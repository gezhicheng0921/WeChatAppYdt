import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
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
        navigationBarTitleText: '客户信息'
    }
    state = {
        datas: [
            { id: '123', name: '测试', addr: '安徽省合肥市高新区xx大道西乡街道11号', linkMan: '李xx，1231211343' },
            { id: '1213', name: '测试2', addr: '安徽省合肥市高新区xx大道西乡街道1122号', linkMan: '李xx，12311211343' },
        ],
        clickBtn: -1,
        openEdit: false,
        editModel: '',//add,edit
        customer: { id: '', name: '', addr: '', linkMan: '' },
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
                this.setState({ clickBtn: value, openEdit: true, editModel: 'add' });
                break;
            case 1:
                this.setState({ clickBtn: value, openEdit: true, editModel: 'edit' });
                break;
            case 2:
                globalset('customer', this.state.customer);
                Taro.navigateBack({ delta: 1 })
                break;
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
        this.setState({ customer: { ...item } })
    }
    handleEditSubmit = () => {
        let { editModel, datas, customer } = this.state;
        if (editModel == 'edit') {
            for (let index = 0; index < datas.length; index++) {
                if (datas[index].id == customer.id) {
                    datas[index] = customer;
                    break;
                }
            }
            this.setState({ openEdit: false, editModel: '' });
        }
        else {
            for (let index = 0; index < datas.length; index++) {
                datas[index]._selected = false
            }
            datas.unshift({ ...customer, _selected: true });
            this.setState({ openEdit: false, editModel: '' });
        }
    }
    handleIdChange = (value) => {
        this.setState({ customer: { ...this.state.customer, id: value } });
    }
    handleNameChange = (value) => {
        this.setState({ customer: { ...this.state.customer, name: value } });
    }
    handleAddrChange = (value) => {
        this.setState({ customer: { ...this.state.customer, addr: value } });
    }
    handleLinkManChange = (value) => {
        this.setState({ customer: { ...this.state.customer, linkMan: value } });
    }
    render() {
        const iconColor = '#97CBFF';
        const iconSize = 30;
        const { datas, openEdit, editModel, customer } = this.state;
        return (
            <View className='index'>
                <View className='at-row h row'>
                    <View className='at-col at-col-4'>名称</View>
                    <View className='at-col at-col-4'>地址</View>
                    <View className='at-col at-col-2'>联系人</View>
                    <View className='at-col at-col-2'>编号</View>
                </View>
                {
                    datas.map((v, i) => {
                        return <View className={'at-row row' + (v._selected && editModel != 'edit' ? ' selected' : '')} onClick={this.handleOnSelect.bind(this, v, i)}>
                            <View className='at-col at-col-4 at-col--wrap'>{v.name}</View>
                            <View className='at-col at-col-4 at-col--wrap'>{v.addr}</View>
                            <View className='at-col at-col-2 at-col--wrap'>{v.linkMan}</View>
                            <View className='at-col at-col-2 at-col--wrap'>{v.id}</View>
                        </View>
                    })
                }
                <View style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Text>技术支持：中鼎科技</Text>
                    {/* <Text>数据一点通解决方案</Text> */}
                </View>
                <View style={{ textAlign: 'center', marginTop: '5px' }}>
                    <Text>数据一点通方案提供商</Text>
                </View>
                <AtTabBar
                    fixed
                    tabList={[
                        { title: '添加', iconType: 'add' },
                        { title: '编辑', iconType: 'list' },
                        { title: '选中', iconType: 'check' }
                    ]}
                    onClick={this.handleBarClick.bind(this)}
                    current={this.state.clickBtn}
                />
                <AtFloatLayout isOpened={openEdit} title="编辑数据">
                    <AtInput customStyle={{ marginTop: "2px" }} name='id' onChange={this.handleIdChange.bind(this)} placeholder='请输入客户编号' title='编号' value={customer.id} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='name' onChange={this.handleNameChange.bind(this)} placeholder='请输入客户名称' title='名称' value={customer.name} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='addr' onChange={this.handleAddrChange.bind(this)} placeholder='请输入地址' title='地址' value={customer.addr} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='linkMan' onChange={this.handleLinkManChange.bind(this)} placeholder='请输入联系人' title='联系人' value={customer.linkMan} />
                    <AtButton onClick={this.handleEditSubmit.bind(this)}>提交</AtButton>
                </AtFloatLayout>
            </View>
        )
    }
}
