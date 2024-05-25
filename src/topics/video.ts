import { Topic } from "~component/cmdk/topic/topic";

export const bilibiliTopic = new Topic({
    name: '哔哩哔哩',
    appearance: {
        backgroundColor: '#00A1D6',
        textColor: '#FFFFFF' // 假设我们希望文本颜色为白色
    },
    conditions: [
        { type: 'domain', value: 'bilibili.com' }
    ]
});

