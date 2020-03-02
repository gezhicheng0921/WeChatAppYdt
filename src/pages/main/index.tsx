import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton, AtGrid, AtIcon } from 'taro-ui'
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
        navigationBarTitleText: '主界面'
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    handleGridClick = (item) => {
        switch (item.value) {
            case '到货接收':
                Taro.navigateTo({ url: '/pages/in/index' })
                break;
            case '出库采集':
                Taro.navigateTo({ url: '/pages/out/index' })
                break;
            case '客户信息':
                Taro.navigateTo({
                    url: '/pages/customer/index'
                })
                break;
            case '产品信息':
                Taro.navigateTo({
                    url: '/pages/product/index'
                })
                break;
            case '追溯查询':
                Taro.navigateTo({ url: '/pages/query/index' })
                break;
            case '关于':
                Taro.navigateTo({ url: '/pages/about/index' })
                break;
            default:
                break;
        }
    }
    render() {
        const iconColor = '#97CBFF';
        const iconSize = 30;
        return (
            <View className='index'>
                <AtGrid onClick={this.handleGridClick} data={
                    [
                        {
                            iconInfo: { value: 'shopping-bag', size: iconSize, color: iconColor },
                            value: '到货接收'
                        },
                        {
                            iconInfo: { value: 'iphone', size: iconSize, color: iconColor },
                            value: '出库采集'
                        },
                        {
                            iconInfo: { value: 'user', size: iconSize, color: iconColor },
                            value: '客户信息'
                        },
                        {
                            iconInfo: { value: 'list', size: iconSize, color: iconColor },
                            value: '产品信息'
                        },
                        {
                            iconInfo: { value: 'user', size: iconSize, color: iconColor },
                            value: '追溯查询'
                        },
                        {
                            iconInfo: { value: 'alert-circle', size: iconSize, color: iconColor },
                            value: '关于'
                        }
                    ]
                } />
                <View style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Text>技术支持：中鼎科技</Text>
                    {/* <Text>数据一点通解决方案</Text> */}
                </View>
                <View style={{ textAlign: 'center', marginTop: '5px' }}>
                    <Text>数据一点通方案提供商</Text>
                </View>
            </View>
        )
    }
}
