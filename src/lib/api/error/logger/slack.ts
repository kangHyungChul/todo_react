// src/lib/api/error/logger/slack.ts
// ------------------------------------------------------------
// Slack에 에러 정보를 전송하는 유틸리티입니다.
// 프로덕션 환경에서 에러 심각도가 HIGH 이상인 경우에만 전송합니다.
// severity가 없거나 LOW인 경우 전송하지 않습니다.
// 에러 정보를 담은 JSON 객체를 Slack Webhook으로 전송합니다.
// 전송 실패 시 console.error로 에러 로깅합니다.

import type { AppError } from '../types';

export const sendToSlack = async (error: AppError) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    // console.log('logger/slack.ts', webhookUrl, error);
    if (!webhookUrl) return;

    const message = {
        text: `🚨[${error.origin}] 에러 발생: ${error.message}`,
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `🚨[${error.origin}] 에러 발생: ${error.message}`,
                    emoji: true
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*URL:* ${error.details?.url || 'N/A'}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*도메인:* ${error.domain}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*카테고리:* ${error.details?.category || 'N/A'}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*코드:* ${error.code}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*메시지:* ${error.message}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*RAW:* ${error.rawMessage}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*상태 코드:* ${error.statusCode}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*심각도:* ${error.severity || 'N/A'}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Trace ID:* ${error.traceId || 'N/A'}`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*발생 시간:* ${error.timestamp || 'N/A'}`
                }
            },
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