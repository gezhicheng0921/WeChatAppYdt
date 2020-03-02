import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
import { AtInput, AtButton, AtFloatLayout, AtIcon, AtTabBar } from 'taro-ui'
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
            { id: '123', name: '测试产品1', spec: '规格1' },
            { id: '1213', name: '测试产品2', spec: '规格1' },
        ],
        clickBtn: -1,
        openEdit: false,
        editModel: '',//add,edit
        product: { id: '', name: '', spec: '' },
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
                globalset('product', this.state.product);
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
        this.setState({ product: { ...item } })
    }
    handleEditSubmit = () => {
        let { editModel, datas, product } = this.state;
        if (editModel == 'edit') {
            for (let index = 0; index < datas.length; index++) {
                if (datas[index].id == product.id) {
                    datas[index] = product;
                    break;
                }
            }
            this.setState({ openEdit: false, editModel: '' });
        }
        else {
            for (let index = 0; index < datas.length; index++) {
                datas[index]._selected = false
            }
            datas.unshift({ ...product, _selected: true });
            this.setState({ openEdit: false, editModel: '' });
        }
    }
    handleIdChange = (value) => {
        this.setState({ product: { ...this.state.product, id: value } });
    }
    handleNameChange = (value) => {
        this.setState({ product: { ...this.state.product, name: value } });
    }
    handleSpecChange = (value) => {
        this.setState({ product: { ...this.state.product, spec: value } });
    }

    render() {
        const iconColor = '#97CBFF';
        const iconSize = 30;
        const { datas, openEdit, editModel, product } = this.state;
        return (
            <View className='index'>
                <View className='at-row h row'>
                    <View className='at-col at-col-4'>名称</View>
                    <View className='at-col at-col-4'>规格</View>
                    <View className='at-col at-col-4'>编号</View>
                </View>
                {
                    datas.map((v, i) => {
                        return <View className={'at-row row' + (v._selected && editModel != 'edit' ? ' selected' : '')} style={{ height: '40px' }} onClick={this.handleOnSelect.bind(this, v, i)}>
                            <View className='at-col at-col-4 at-col--wrap'>{v.name}</View>
                            <View className='at-col at-col-4 at-col--wrap'>{v.spec}</View>
                            <View className='at-col at-col-4 at-col--wrap'>{v.id}</View>
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
                    <AtInput customStyle={{ marginTop: "2px" }} name='id' onChange={this.handleIdChange.bind(this)} placeholder='请输入产品编号' title='编号' value={product.id} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='name' onChange={this.handleNameChange.bind(this)} placeholder='请输入产品名称' title='名称' value={product.name} />
                    <AtInput customStyle={{ marginTop: "2px" }} name='spec' onChange={this.handleSpecChange.bind(this)} placeholder='请输入产品规格' title='规格' value={product.spec} />
                    <AtButton onClick={this.handleEditSubmit.bind(this)}>提交</AtButton>
                </AtFloatLayout>
            </View>
        )
    }
}
