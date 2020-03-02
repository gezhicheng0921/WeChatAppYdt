import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Icon, ScrollView } from '@tarojs/components'
import { AtInput, AtButton, AtFloatLayout, AtNavBar, AtTabBar } from 'taro-ui'
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
        navigationBarTitleText: '到货接收'
    }
    state = {
        datas: [
            { id: '1230', deliverydate: '2019-09-22', prodname: '测试产品1', prodnum: '200', acceptnum: '', acceptmemo: '', produnit: '大袋', cusaddr: '安徽省合肥市高新区xx大道西乡街道1122号', cuslinkMan: '李xx，1231211343', cusid: '121', cusname: '测试客户1', },
            { id: '1231', deliverydate: '2019-09-23', prodname: '测试产品2', prodnum: '500', acceptnum: '', acceptmemo: '', produnit: '大袋', cusaddr: '安徽省合肥市高新区xx大道西乡街道1122号', cuslinkMan: '李xx，1231211343', cusid: '121', cusname: '测试客户1', },
        ],
        clickBtn: -1,
        openEdit: false,
        editModel: '',//add,edit
        bill: { id: '', deliverydate: '', prodname: '', prodnum: '', acceptnum: '', acceptmemo: '', produnit: '', cusaddr: '', cuslinkMan: '', cusid: '', cusname: '', },
    }
    componentWillMount() {
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    handleBarClick = (value) => {
        switch (value) {
            case 0:
                this.setState({ clickBtn: value, openEdit: true, editModel: 'edit' });
                break;
            // case 1:
            //     this.setState({ clickBtn: value, openEdit: true, editModel: 'edit' });
            //     break;
            // case 2:
            //     globalset('bill', this.state.bill);
            //     Taro.navigateBack({ delta: 1 })
            //     break;
            default:
                break;
        }
    }
    handleOnSelect = (item, index, e) => {
        item = { ...item, _selected: true };
        this.state.datas.map((v, i) => {
            if (i == index) v._selected = true;
            else v._selected = false;
        })
        this.setState({ bill: { ...item } })
    }
    handleEditSubmit = () => {
        let { editModel, datas, bill } = this.state;
        if (editModel == 'edit') {
            for (let index = 0; index < datas.length; index++) {
                if (datas[index].id == bill.id) {
                    datas[index] = bill;
                    break;
                }
            }
            this.setState({ openEdit: false, editModel: '' });
        }
        else {
            for (let index = 0; index < datas.length; index++) {
                datas[index]._selected = false
            }
            datas.unshift({ ...bill, _selected: true });
            this.setState({ openEdit: false, editModel: '' });
        }
    }
    handleacceptmemoChange = (value) => {
        this.setState({ bill: { ...this.state.bill, acceptmemo: value } });
    }
    handleacceptnumChange = (value) => {
        this.setState({ bill: { ...this.state.bill, acceptnum: value } });
    }
    render() {
        const iconColor = '#97CBFF';
        const iconSize = 30;
        const { datas, openEdit, editModel, bill } = this.state;
        return (
            <View>
                <ScrollView scrollX style={{ width: '600px' }} className='index'>
                    <View className='at-row h row'>
                        <View className='at-col at-col-2'>单号</View>
                        <View className='at-col at-col-2'>发货日期</View>
                        {/* <View className='at-col at-col-2'>收货地址</View> */}
                        {/* <View className='at-col at-col-2'>联系人</View> */}
                        <View className='at-col at-col-2'>产品名称</View>
                        <View className='at-col at-col-2'>发货数量</View>
                        <View className='at-col at-col-2'>实收数量</View>
                        <View className='at-col at-col-2'>收货备注</View>
                        <View className='at-col at-col-2'>单位</View>
                        {/* <View className='at-col at-col-2'>收货单位编号</View> */}
                        {/* <View className='at-col at-col-2'>收货单位名称</View> */}
                    </View>
                    {
                        datas.map((v, i) => {
                            return <View className={'at-row row' + (v._selected && editModel != 'edit' ? ' selected' : '')} style={{ height: '40px',verticalAlign:'middle' }} onClick={this.handleOnSelect.bind(this, v, i)}>
                                <View className='at-col at-col-2 at-col'>{v.id}</View>
                                <View className='at-col at-col-2 at-col'>{v.deliverydate}</View>
                                <View className='at-col at-col-2 at-col'>{v.prodname}</View>
                                <View className='at-col at-col-2 at-col'>{v.prodnum}</View>
                                <View className='at-col at-col-2 at-col'>{v.acceptnum}</View>
                                <View className='at-col at-col-2 at-col'>{v.acceptmemo}</View>
                                <View className='at-col at-col-2 at-col'>{v.produnit}</View>
                                {/* <View className='at-col at-col-3 at-col--wrap'>{v.id}</View>
                            <View className='at-col at-col-3 at-col--wrap'>{v.deliverydate}</View>
                            <View className='at-col at-col-3 at-col--wrap'>{v.prodname}</View>
                            <View className='at-col at-col-1 at-col--wrap'>{v.prodnum}</View>
                            <View className='at-col at-col-1 at-col--wrap'>{v.acceptnum}</View>
                            <View className='at-col at-col-1 at-col--wrap'>{v.produnit}</View> */}


                                {/* <View className='at-col at-col-2 at-col--wrap'>{v.cusaddr}</View> */}
                                {/* <View className='at-col at-col-2 at-col--wrap'>{v.cuslinkMan}</View> */}
                                {/* <View className='at-col at-col-2 at-col--wrap'>{v.cusid}</View> */}
                                {/* <View className='at-col at-col-2 at-col--wrap'>{v.cusname}</View> */}
                            </View>
                        })
                    }

                </ScrollView>
                <View style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Text>技术支持：中鼎科技</Text>
                    {/* <Text>数据一点通解决方案</Text> */}
                </View>
                <View style={{ textAlign: 'center', marginTop: '5px' }}>
                    <Text>数据一点通方案提供商</Text>
                </View>
                <AtTabBar
                    fixed
                    tabList={[
                        // { title: '添加', iconType: 'add' },
                        { title: '到货登记', iconType: 'check' },
                        // { title: '详情', iconType: 'check' }
                    ]}
                    onClick={this.handleBarClick.bind(this)}
                    current={this.state.clickBtn}
                />
                <AtFloatLayout isOpened={openEdit} title="编辑数据">
                    <AtInput customStyle={{ marginTop: "2px" }} name='acceptnum' onChange={this.handleacceptnumChange.bind(this)} placeholder='请输入实收数量' title='实收数量' value={bill.acceptnum} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='acceptmemo' onChange={this.handleacceptmemoChange.bind(this)} placeholder='收货备注' title='收货备注' value={bill.acceptmemo} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='id' disabled title='编号' value={bill.id} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='deliverydate' disabled title='发货日期' value={bill.deliverydate} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='prodnum' disabled placeholder='发货数量' title='发货数量' value={bill.prodnum} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='produnit' disabled title='单位' value={bill.produnit} />
                    <AtButton onClick={this.handleEditSubmit.bind(this)}>提交</AtButton>
                </AtFloatLayout>
            </View>
        )
    }
}
