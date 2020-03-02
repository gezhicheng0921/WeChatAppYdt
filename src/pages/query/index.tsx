import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Radio, RadioGroup } from '@tarojs/components'
import { AtInput, AtButton, AtDivider, AtTabs, AtTabsPane, AtList, AtListItem, AtMessage } from 'taro-ui'
import './index.scss'
import { set as globalset, get as globalget } from '../../global_data.js'

export default class Index extends Component {

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '查询'
    }
    state = {
        scanValue: '',
        current: 0,
        codes: [],
        codelen: 20,
        cnt1: 0,
        cnt2: 0,
        cntT: 0,
        customer: { id: '', name: '', addr: '', linkMan: '' },
        product: { id: '', name: '', spec: '' },
        unit: '0',
        msg: {
            message: '',//消息内容
            type: '',//info，success，error，warning
            duration: '3000'//持续时间
        }
    }
    componentWillMount() {
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() {
    }

    componentDidHide() { }


    hanleOnClick = () => {
        Taro.scanCode({
            success: (res) => {
                this.setState({ codes: [{ unit: this.state.unit, code: res.result }, ...this.state.codes] })
            }
        })
    }
    handleTabClick = (value) => {
        this.setState({
            current: value
        })
    }
    handleUnitChange = (e) => {
        this.setState({ unit: e.detail.value })
    }

    render() {
        const { scanValue, codes, customer, product, msg, codelen } = this.state;
        const codelist = <View style='font-size:18px;text-align:center;height:auto;'><AtList>
            {codes.map((v) => {
                return <AtListItem title={v.code}></AtListItem>
            })}</AtList></View>;
        return (
            <View className='index' >
                <AtMessage />
                <View>
                    <AtInput name='uid' placeholder='请扫描或输入条码' title='条码' value={scanValue} />
                    {/* <View className='at-article__h3'>
                        扫描单位： </View><RadioGroup onChange={this.handleUnitChange.bind(this)}>
                        <Radio value='1'>瓶/小袋[{this.state.cnt1}]</Radio>
                        <Radio value='2'>箱/大袋[{this.state.cnt2}]</Radio>
                        <Radio value='t'>托盘[{this.state.cntT}]</Radio>
                    </RadioGroup> */}
                    <AtButton customStyle={{ marginTop: "20px" }} onClick={this.hanleOnClick.bind(this)}>扫描</AtButton>
                    <AtDivider content='查询结果' />
                    {codelist}
{/* 
                    <AtTabs
                        current={this.state.current}
                        scroll
                        tabList={[
                            { title: '采集条码' },
                        ]}
                        onClick={this.handleTabClick.bind(this)}>
                        <AtTabsPane current={this.state.current} index={0}>
                        </AtTabsPane>
                    </AtTabs> */}
                </View >
            </View >
        )
    }
}
