// src/lib/api/error/logger/slack.ts
// ------------------------------------------------------------
// Slack에 에러 정보를 전송하는 유틸리티입니다.
// 프로덕션 환경에서 에러 심각도가 HIGH 이상인 경우에만 전송합니다.
// severity가 없거나 LOW인 경우 전송하지 않습니다.
// 에러 정보를 담은 JSON 객체를 Slack Webhook으로 전송합니다.
// 전송 실패 시 console.error로 에러 로깅합니다.

import type { AppError } from '@/lib/types/error';

export const sendToSlack = async (error: AppError) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    console.log('logger/slack.ts', webhookUrl, process.env.NODE_ENV);
    if (!webhookUrl) return;

    const message = {
        text: `🚨 에러 발생: ${error.message}`,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*에러 발생*\n*도메인:* ${error.domain}\n*코드:* ${error.code}\n*메시지:* ${error.message}`
                }
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*상태 코드:*\n${error.statusCode}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*심각도:*\n${error.severity || 'N/A'}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Trace ID:*\n${error.traceId || 'N/A'}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*발생 시간:*\n${error.timestamp || 'N/A'}`
                    }
                ]
            }
        ]
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });
    } catch (err) {
        console.error('Slack 전송 실패:', err);
    }
};