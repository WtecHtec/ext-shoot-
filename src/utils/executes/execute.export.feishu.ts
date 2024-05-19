

const executeExportFeishu = (datas, feishuTableTabId, matchs) => {
	
// eslint-disable-next-line @typescript-eslint/no-unused-vars
	class ExecuteHandle {
		private waitevents: any[];
		constructor() {
			this.waitevents = [];
		}
		async getDomByXPath(xpath, delay = 2 * 1000, max = 10) {
			return new Promise((resolve, reject) => {
				const getDom = (current) => {
					const xnd = document.evaluate(xpath, document);
					const dom = xnd.iterateNext();
					if (dom) {
						resolve(dom);
						return;
					} else {
						if (max < current) {
							reject('not find dom');
						}
						setTimeout(() => {
							getDom(current + 1);
						}, delay);
					}
			};
				getDom(0);
			});
		}
		waitPipe(fn, delay = 2 * 1000, ...args) {
			this.waitevents.push({
				fn,
				delay,
				args: [...args],
			});
			return this;
		}
		runWaitTime(event, step, resolve, reject, arg) {
			if (!event) {
				typeof resolve === 'function' && resolve(arg);
				return;
			}
			const { fn, delay, args } = event;
			setTimeout(async () => {
				try {
					const arg = await fn(this, args);
					const nextEvent = this.waitevents.shift();
					if (arg && nextEvent) {
						nextEvent.args = [...nextEvent.args, arg];
					}
					this.runWaitTime(nextEvent, step + 1, resolve, reject, arg);
				} catch (err) {
					typeof reject === 'function' && reject(step, err);
					return;
				}
			}, delay);
		}
		runWait(resolve, reject) {
			const event = this.waitevents.shift();
			this.runWaitTime(event, 0, resolve, reject, '');
		}
	}

new ExecuteHandle()
	.waitPipe( async (ctx) => {
		// step 1: 点击插件
		const copyBtn = await ctx.getDomByXPath('/html/body/div[1]/div/div[2]/div/div/div[2]/div[1]/div[2]/div[2]/div/div[1]/div[2]/button[3]');
		copyBtn && copyBtn.click();
	}, 2 * 1000)
	.waitPipe(async (ctx) => {
		// step 2: 点击自定义插件
		const copyBtn = await ctx.getDomByXPath('/html/body/div[1]/div/div[6]/div[1]/div[1]/div/div[6]/div[2]/div[2]/div[5]/button[2]');
		copyBtn && copyBtn.click();
	})
	.waitPipe(async (ctx) => {
		// step 3: 点击获取授权码
		const copyBtn = await ctx.getDomByXPath('/html/body/div[1]/div/div[6]/div[1]/div[1]/div/div[6]/div[2]/div[2]/div/div[1]/div/div/div/span[3]');
		copyBtn && copyBtn.click();
	})
	.waitPipe(async (ctx) => {
		// step 4: 点击 启用
		const copyBtn = await ctx.getDomByXPath('/html/body/div[23]/div/div[4]/div/div/div/div[2]/label');
		copyBtn && copyBtn.click();
	})
	.waitPipe(async (ctx) => {
		// step 5: 拿到授权码
		const copyBtn = await ctx.getDomByXPath('/html/body/div[23]/div/div[4]/div/div/div/div[2]/div[2]/div/div');
		return copyBtn.innerHTML;
	})
	.waitPipe(async (ctx, args) => {
		// step 6: 发起请求，关闭授权码弹窗

		window.fetch('http://localhost:3000/jike_insert', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tableData: datas,
				config: {
					APP_TOKEN: matchs[2],
					TABLEID: matchs[3],
					PERSONAL_BASE_TOKEN: args[0],
				}
			}),
		});
		const copyBtn = await ctx.getDomByXPath('/html/body/div[23]/div/div[4]/div/div/div/div[3]/div/button');
		copyBtn && copyBtn.click();
	})
	.runWait(() => {
		console.log('成功');
	}, (...args) => {
		console.log('失败', ...args);
	});
};
export default executeExportFeishu;