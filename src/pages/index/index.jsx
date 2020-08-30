import Taro from '@tarojs/taro'
import React, {Component} from 'react'
import {View, Text, ScrollView, Button} from '@tarojs/components'
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
    const datas = [{title: '显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题显示一行标题', desc: '实发数烦得很还是和的舒服舒服师傅好很合适的方式符合发给谁护士差多少分蛋黄酥返回后结婚戒指小百合居第三步拒'},
      {title: '显示一行标题显示一行标题2显示一行标题显示一行标题2显示一行标题显示一行标题2显示一行标题显示一行标题2显示一行标题显示一行标题2', desc: '实发数烦得很还是和的舒服舒服师傅好很合适的方式符合发给谁护士差多少分蛋黄酥返回后结婚戒指小百合居第三步拒'}];
    return datas.map((item, index) => <View key={index}>
      <Text className='text-title'>{item.title}</Text>
      <Text className='text-desc'>{item.desc}</Text>
    </View>)
  }

  render() {
    const {loading} = this.state
    return (
      <View className='container'>
        <Text>问题描述：使用text-overflow 设置Text 显示行数，超过行数显示...， 小程序正常，H5 在Chorme 上正常，在手机以及Safari浏览器上渲染异常，
        当下面是条件渲染时第一次文字截断没有生效，调整到其它页面返回后，截断正常了
        </Text>
        <Button onClick={()=>{
          Taro.navigateTo({url:'./TestPage'})
        }}
        >跳转到另一个页面</Button>
        <Text className='text-title'>这一段单行显示正这一段单行显示正常这一段单行显示正常这一段单行显示正常这一段单行显示正常这一段单行显示正常这一段单行显示正常常</Text>

        <ScrollView>
          {loading ? <Text>正在加载</Text> : this.renderList()}
        </ScrollView>
      </View>
    )
  }
}
