import Taro from '@tarojs/taro'
import React, {Component} from 'react'
import {View, Text, ScrollView, Button, Image} from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  state = {
    loading: true
  }

  componentWillMount() {
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 3000)
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  renderList = () => {
    const datas = [{
      title: '显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题',
      desc: '实发数烦得很还是和的舒服舒服师傅好很合适的方式符合发给谁护士差多少分蛋黄酥返回后结婚戒指小百合居第三步拒'
    },
      {
        title: '显示一行标题显示一行标题2显示一行标题显示一行标题2显示一行标题显示一行标题2显示一行标题显示一行标题2显示一行标题显示一行标题2',
        desc: '实发数烦得很还是和的舒服舒服师傅好很合适的方式符合发给谁护士差多少分蛋黄酥返回后结婚戒指小百合居第三步拒'
      }];
    return datas.map((item, index) => <View key={index}>
      <Text className='text-title'>{item.title}</Text>
      <Text className='text-desc'>{item.desc}</Text>
    </View>)
  }
  renderImageList = () => {
    return ['', '', '', '','', ''].map((item,index) => {
      return <View
        key={'index'+index}
        style={{
        width: 60,
        display: 'inline-block',
        paddingRight:'20px'
      }}
      >
      <View style={{flexDirection:'column',display:'flex'}}>
        <Text>内容{index}</Text>
        <Image
          style={{width: 50, height: 50,backgroundColor:'#f0f'}}
          src='https://pier-qa.oss-cn-hangzhou.aliyuncs.com/static/img/post/f95c2ec0-d727-4b54-84b1-187bc1638423/2020-6-10/62b98910-aaf4-11ea-988f-5986c1ea3d47.jpg?x-oss-process=image/resize,w_248'
        />
      </View>
      </View>
    })
  }

  render() {
    const {loading} = this.state
    return (
      <View className='container'>
        <Text>问题描述：使用text-overflow 设置Text 显示行数，超过行数显示...， 小程序正常，H5 在Chorme 上正常，在手机以及Safari浏览器上渲染异常，
          当Text是条件渲染时第一次文字截断没有生效，跳转到其它页面返回后，截断正常了
        </Text>
        <Button onClick={() => {
          Taro.navigateTo({url: './TestPage'})
        }}
        >跳转到另一个页面</Button>
        <Text className='text-title'></Text>

        <ScrollView scrollY style={{}}>
          {loading ? <Text>正在加载</Text> : this.renderList()}
          <ScrollView scrollX style={{
            boxSizing: "border-box",
            whiteSpace: 'nowrap'
          }}
          >
            {this.renderImageList()}
          </ScrollView>
        </ScrollView>
      </View>
    )
  }
}
