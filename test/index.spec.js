import automator from 'miniprogram-automator'

// describe('index', () => {
//   let miniProgram
//   let page
//
//   beforeAll(async () => {
//     miniProgram = await automator.launch({
//       cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
//       projectPath: '/Users/work/weChat/miniprogram-demo',
//       timeout: 30000
//     })
//   }, 30000)
//   it('desc', async () => {
//     page = await miniProgram.reLaunch('/page/component/index')
//     await page.waitFor(500)
//     const desc = await page.$('.index-desc')
//     expect(desc.tagName).toBe('view')
//     expect(await desc.text()).toContain('以下将展示小程序官方组件能力')
//   })
//   // it('test index', async() => {
//   //   page = await miniProgram.reLaunch('/pages/index/index')
//   //   await page.waitFor(500)
//   //   const element = await page.$('.userinfo-avatar')
//   //   console.log(await element.attribute('class'))
//   //   await element.tap()
//   // });

// })

//  yarn dev:weapp
//  cd /Applications/wechatwebdevtools.app/Contents/MacOS
// ./cli auto --project /Users/work/test/taroDemo3.2.10/dist --auto-port 9420
describe('index', () => {

  let miniProgram
  let page
  const wsEndpoint = 'ws://127.0.0.1:9420'
  beforeAll(async () => {
    miniProgram = await automator.connect({
      wsEndpoint
    })
  }, 30000)

  it('test index', async () => {
    page = await miniProgram.reLaunch('/pages/index/index')
    await page.waitFor(500)
    const desc = await page.$('.add_btn')
    const numText = await page.$('.num_text')
    const numTextId = await page.$('#numTextId')
    expect(await numTextId.attribute('class')).toBe('num_text')

    await desc.tap()
    await page.waitFor(500)
    console.log("1111", await numText.text())
    expect(await desc.text()).toContain('+')

    const jump_btn = await page.$('.jump_btn')
    jump_btn.tap()
    jest.setTimeout(500)
    await page.waitFor(500)
    const  page2 = await miniProgram.currentPage()
    const page_text = await page2.$('.page_text')
    const num_text1 = await page2.$('.num_text')
    console.log('11111', await num_text1.text())
    console.log('11111', await page_text.text())
    expect(page2.path).toBe('pages/index2/index')
    expect(await page_text.text()).toContain('我是第二页')
  })
})
