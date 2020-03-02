
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton, AtDivider } from 'taro-ui'
import './index.scss'

export default class Index extends Component {

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '首页'
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    hanleOnClick = () => {
        Taro.redirectTo({ url: '/pages/main/index' });
    }
    render() {
        return (
            <View className='index'>
                <View style={{ marginTop: "100px" }}>
                    <View className='t1'>欢迎使用中鼎科技解决方案</View>
                    <View className='t2'>我们提供如下解决方案</View>
                    <View className='t2'>生产过程管控一点通</View>
                    <View className='t2'>仓储一点通</View>
                    <View className='t2'>经销一点通</View>
                    <View className='t2'>流向追溯一点通</View>
                    <View className='t2'>产品全生命周期追溯一点通</View>
                    <View className='t2'>数据管理一点通</View>
                </View>
            </View>
        )
    }
}
