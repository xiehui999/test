import React, {Component} from 'react'
import {View, Text, ScrollView} from '@tarojs/components'
import './index.scss'

export default class TestPage extends Component {
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
      <View className='index'>
        <Text>该页面返回后，第一个页面的显示正常了</Text>
        <Text className='text-title'>这一段单行显示正这一段单行显示正常这一段单行显示正常这一段单行显示正常这一段单行显示正常这一段单行显示正常这一段单行显示正常常</Text>

        <ScrollView>
          {loading ? <Text>正在加载</Text> : this.renderList()}
        </ScrollView>
      </View>
    )
  }
}
