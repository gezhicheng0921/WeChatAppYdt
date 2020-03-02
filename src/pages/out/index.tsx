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
        navigationBarTitleText: '出库采集'
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
        let customer = globalget('customer');
        if (customer)
            this.setState({ customer: customer })
        let product = globalget('product');
        if (product)
            this.setState({ product: product })
    }

    componentDidHide() { }


    hanleOnClick = () => {
        if (this.state.unit == '0') {
            Taro.vibrateLong()
            Taro.atMessage({
                message: '请选择扫描单位！',//消息内容
                type: 'error',//info，success，error，warning
            })
        }
        else
            Taro.scanCode({
                success: (res) => {
                    const code = res.result;
                    console.log(this.state.codelen)
                    console.log(code.length)
                    if (code.length != this.state.codelen) {
                        Taro.vibrateLong()
                        Taro.atMessage({
                            message: '条码长度有误！',//消息内容
                            type: 'error',//info，success，error，warning
                        })
                    } else {
                        this.setState({ codes: [{ unit: this.state.unit, code: code }, ...this.state.codes], current: 1 })
                    }
                }
            })
    }
    handleTabClick = (value) => {
        this.setState({
            current: value
        })
    }

    handleSelectCustomerClick = () => {
        Taro.navigateTo({ url: '/pages/customer/index' })
    }
    handleSelectProductClick = () => {
        Taro.navigateTo({ url: '/pages/product/index' })
    }
    handleUnitChange = (e) => {
        this.setState({ unit: e.detail.value })
    }
    handleCodelenChange = (value) => {
        let len = parseInt(value);
        this.setState({ codelen: len });
    }
    render() {
        const { scanValue, codes, customer, product, msg, codelen } = this.state;
        this.state.cnt1 = 0; this.state.cnt2 = 0; this.state.cntT = 0
        const codelist = <View style='font-size:18px;text-align:center;height:auto;'><AtList>
            {codes.map((v) => {
                if (v.unit == '1') {
                    this.state.cnt1++;
                } else if (v.unit == '2') {
                    this.state.cnt2++;
                } else if (v.unit == 't') {
                    this.state.cntT++;
                }
                return <AtListItem title={v.unit + '-|' + v.code}></AtListItem>
            })}</AtList></View>;
        return (
            <View className='index' >
                <AtMessage />
                <View>
                    <AtInput name='uid' placeholder='请扫描或输入条码' title='条码' value={scanValue} />
                    <AtInput name='codelen' title='条码长度' placeholder='为防止微信误读，请输入条码长度进行判断' onChange={this.handleCodelenChange.bind(this)} value={codelen} />
                    <View className='at-article__h3'>
                        扫描单位： </View><RadioGroup onChange={this.handleUnitChange.bind(this)}>
                        <Radio value='1'>瓶/小袋[{this.state.cnt1}]</Radio>
                        <Radio value='2'>箱/大袋[{this.state.cnt2}]</Radio>
                        <Radio value='t'>托盘[{this.state.cntT}]</Radio>
                    </RadioGroup>
                    <AtButton customStyle={{ marginTop: "20px" }} onClick={this.hanleOnClick.bind(this)}>扫描</AtButton>
                    <AtDivider content='出库信息' />
                    <AtTabs
                        current={this.state.current}
                        scroll
                        tabList={[
                            { title: '单据信息' },
                            { title: '采集条码' },
                        ]}
                        onClick={this.handleTabClick.bind(this)}>
                        <AtTabsPane current={this.state.current} index={0}>
                            <View style='font-size:18px;text-align:center;height:auto;'>
                                <AtList>
                                    <AtListItem title={customer.name} extraText='选择客户' arrow='right' onClick={this.handleSelectCustomerClick.bind(this)} >
                                    </AtListItem>
                                </AtList>
                                {customer.id ?
                                    <View style={{ textAlign: 'left' }}>  <View className='at-article__h3'>
                                        编号：  {customer.id}
                                    </View>
                                        <View className='at-article__h3'>
                                            名称  {customer.name}
                                        </View>
                                        <View className='at-article__h3'>
                                            联系人： {customer.linkMan}
                                        </View>
                                        <View className='at-article__h3'>
                                            地址： {customer.addr}
                                        </View>
                                    </View> : ''
                                }

                                <AtList>
                                    <AtListItem title={product.name} extraText='选择产品' arrow='right' onClick={this.handleSelectProductClick.bind(this)} />
                                    {
                                        product.id ? <View style={{ textAlign: 'left' }}>
                                            <View className='at-article__h3'>
                                                编号：  {product.id}
                                            </View>
                                            <View className='at-article__h3'>
                                                名称  {product.name}
                                            </View>
                                            <View className='at-article__h3'>
                                                规格 {product.spec}
                                            </View>
                                        </View> : ''
                                    }
                                </AtList>
                            </View>
                        </AtTabsPane>
                        <AtTabsPane current={this.state.current} index={1}>
                            {codelist}
                        </AtTabsPane>
                    </AtTabs>
                </View>
                {/* <View style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Text>技术支持：中鼎科技</Text>
                </View>
                <View style={{ textAlign: 'center', marginTop: '5px' }}>
                    <Text>数据一点通方案提供商</Text>
                </View> */}
            </View >
        )
    }
}
