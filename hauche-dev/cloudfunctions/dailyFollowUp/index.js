// dailyFollowUp 云函数 - 每日跟进提醒
// 定时触发：每天10:00执行
// 查询需要跟进的线索，生成跟进建议，创建跟进任务并推送通知
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.getEnv() })
const db = cloud.database()
const _ = db.command

// 根据线索状态生成跟进建议模板
function generateFollowUpSuggestion(lead) {
  const statusSuggestions = {
    new: {
      suggestion: '新线索首次跟进，建议尽快联系了解需求',
      channel: 'phone',
      priority: 'high'
    },
    following: {
      suggestion: '持续跟进中，建议了解最新意向变化',
      channel: 'wechat',
      priority: 'medium'
    },
    negotiating: {
      suggestion: '正在谈判阶段，建议主动提供优惠方案促单',
      channel: 'phone',
      priority: 'high'
    },
    visited: {
      suggestion: '已到店客户，建议回访体验感受并推进决策',
      channel: 'wechat',
      priority: 'medium'
    },
    lost: {
      suggestion: '流失客户唤醒，建议以新优惠或新车资讯重新触达',
      channel: 'wechat',
      priority: 'low'
    }
  }

  return statusSuggestions[lead.status] || statusSuggestions.following
}

exports.main = async (event, context) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  console.log(`每日跟进任务开始执行: ${today.toLocaleString()}`)

  const results = {
    date: today.toISOString().split('T')[0],
    processedLeads: 0,
    createdTasks: 0,
    pushedNotifications: 0,
    errors: []
  }

  try {
    // 查询所有需要跟进的线索
    // 条件：nextFollowUpDate <= 今天 且 status 为活跃状态（排除已成交和已流失的）
    const leadsRes = await db.collection('leads')
      .where({
        nextFollowUpDate: _.lte(today),
        status: _.in(['new', 'following', 'negotiating', 'visited'])
      })
      .limit(100)
      .get()

    const leads = leadsRes.data || []
    console.log(`找到 ${leads.length} 条待跟进线索`)

    for (const lead of leads) {
      try {
        // 生成跟进建议
        const suggestion = generateFollowUpSuggestion(lead)

        // 检查是否已有待办跟进任务
        const existingTask = await db.collection('services')
          .where({
            leadId: lead._id,
            type: 'follow_up',
            status: 'pending'
          })
          .count()

        if (existingTask.total > 0) {
          console.log(`线索 ${lead._id} 已有待办任务，跳过`)
          results.processedLeads++
          continue
        }

        // 创建跟进任务
        const taskData = {
          leadId: lead._id,
          leadName: lead.name,
          dealerId: lead.dealerId,
          type: 'follow_up',
          status: 'pending',
          suggestion: suggestion.suggestion,
          channel: suggestion.channel,
          priority: suggestion.priority,
          scheduledDate: db.serverDate(),
          createTime: db.serverDate()
        }

        await db.collection('services').add({ data: taskData })
        results.createdTasks++

        // 更新线索的下次跟进日期（默认3天后）
        const nextDate = new Date()
        nextDate.setDate(nextDate.getDate() + 3)

        await db.collection('leads').doc(lead._id).update({
          data: {
            nextFollowUpDate: nextDate,
            updateTime: db.serverDate()
          }
        })

        // 推送通知给对应经销商
        try {
          if (lead.dealerId) {
            const dealerRes = await db.collection('dealers').doc(lead.dealerId).get()
            const dealer = dealerRes.data

            if (dealer && dealer.openid) {
              await cloud.openapi.subscribeMessage.send({
                touser: dealer.openid,
                templateId: process.env.FOLLOWUP_TEMPLATE_ID || '',
                page: 'pages/leads/detail?id=' + lead._id,
                data: {
                  thing1: { value: lead.name || '客户' },
                  thing2: { value: suggestion.suggestion.substring(0, 20) },
                  time3: { value: today.toISOString().split('T')[0] }
                }
              })
              results.pushedNotifications++
            }
          }
        } catch (notifyErr) {
          console.warn(`通知推送失败: ${notifyErr.message}`)
        }

        results.processedLeads++
      } catch (leadErr) {
        console.error(`处理线索 ${lead._id} 时出错:`, leadErr.message)
        results.errors.push({
          leadId: lead._id,
          error: leadErr.message
        })
      }
    }

    // 记录执行日志
    await db.collection('cron_logs').add({
      data: {
        function: 'dailyFollowUp',
        executeDate: today.toISOString().split('T')[0],
        processedLeads: results.processedLeads,
        createdTasks: results.createdTasks,
        pushedNotifications: results.pushedNotifications,
        createTime: db.serverDate()
      }
    })

    console.log(`每日跟进任务完成: 处理 ${results.processedLeads} 条线索, 创建 ${results.createdTasks} 个任务`)
  } catch (err) {
    console.error('每日跟进任务执行失败:', err)
    results.errors.push({ global: err.message })
  }

  return { code: 0, message: 'ok', data: results }
}
