import Taro, { Component, Config, connectSocket } from '@tarojs/taro'
import { View, Text, Icon, ScrollView } from '@tarojs/components'
import { AtButton, AtFloatLayout, AtTabBar, AtCard, AtLoadMore, AtDrawer, AtSearchBar,Atcurtain, AtActivityIndicator,AtTextarea, AtDivider } from 'taro-ui'
import * as EditItem from './item'
import * as formSvr from '../../services/form'

import { set as globalset, get as globalget, set, CONSTS } from '../../global_data.js'
import './list.scss'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  config: Config = {
    navigationBarTitleText: ''
  }
  state = {
    formId: '',//当前表单编号
    formName: '',
    fields: [],
    datas: { totalCount: 0, items: [] },
    selectedIds: [],
    operates: [],//所有操作
    curOperate: {},//当前操作
    clickBtn: -1,
    showEditBtn: false,//显示操作按钮
    showEditForm: false,//显示操作界面
    qryStr: '',//查询字符串
    qryFieldId: '',//查询列
    editModel: '',//add,edit
    pId: '',
    pFieldId: '',//关联外键列
    loadStatus: 'loading',
    pageNum: 1,
    shareId:'',
    tenancyId:''
  }
  componentWillReceiveProps(props) {
    console.log('list props')
  }
  componentWillMount() {
    const formid = this.$router.params.id;//通过查询字符串获取formid
    const formName = this.$router.params.name;//通过查询字符串获取formid
    this.state.formId = formid;
    this.state.formName = formName;
    Taro.setNavigationBarTitle({ title: formName })
    this.loadView('');
    formSvr.qryOperates(formid).then(res => {
      const operates = res.data.result;
      this.setState({ operates: operates.items });
      
    })
  }
  //初次加载查询数据
  loadView = (qryStr) => {
    this.state.qryStr = qryStr;
    let qryClms = this.state.pFieldId.length > 0 ? [{ id: this.state.pFieldId, value: [this.state.pId], qryType: "Id", ableType: 'Filter' }] : [];
    if (this.state.qryFieldId) qryClms.push({ id: this.state.qryFieldId, value: [qryStr], lableType: 'Filter' })

    formSvr.queryByClmAndReturnField(this.state.formId, qryClms).then((res) => {
      const data = res.data.result;
      this.setState({ fields: data.fields, datas: data.datas, qryFieldId: data.fields[0].id, loadStatus: 'more' })
    })
  }
  //查询,isAppend-是否追加查询结果
  query = (qryStr, isAppend) => {
    this.state.qryStr = qryStr;
    let qryClms = this.state.pFieldId.length > 0 ? [{ id: this.state.pFieldId, value: [this.state.pId], qryType: "Id", ableType: 'Filter' }] : [];
    if (this.state.qryFieldId) qryClms.push({ id: this.state.qryFieldId, value: [qryStr], qryType: 'ValueLike', lableType: 'Filter' })
    if (!isAppend) this.state.pageNum = 1;
    formSvr.query(this.state.formId, qryClms, this.state.pageNum).then((res) => {
      const data = res.data.result;
      if (data.items.length > 0) {
        if (isAppend) { this.setState({ datas: { totalCount: data.totalCount, items: [...this.state.datas.items, data.items] }, loadStatus: 'more' }) }
        else { this.setState({ datas: data, loadStatus: 'more' }) }
      }
      else { this.setState({ loadStatus: 'noMore' }) }
    })
  }
  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleBarClick = (value) => {
    switch (value) {
      case 0:
        this.setState({ clickBtn: value, showEditBtn: true, editModel: 'edit' });
        break;
        case 1:
        break;
      default:
        break;
    }
  }

  handleOperateClick = (v) => {
    if(v.name=='分享'){
      if(this.state.selectedIds.length>1){
      console.log('请勿选择多条数据');
      return;
      }else if(this.state.selectedIds.length===0){
        console.log('请选择需要分享的数据');
        return;
      }else{
        formSvr.shareCreateTest(this.state.formId, this.state.selectedIds, 1).then((res1) => {
          if(res1.data.success){
            this.state.shareId=res1.data.result.id;
            this.state.tenancyId =res1.data.result.tenantId;
          }else{
            console.log('分享失败：',res1.error);//+;
            return;
          }
         
        });
      } 
    }
      this.setState({ showEditBtn: false, showEditForm: true, curOperate: v });
    
   

   
  }

  handleEditFormClose = () => {
    this.state.showEditForm = false;
    this.query('', false);
    // this.setState({ showEditForm: false });
  }

  // handleOnSelect = (item, index, e) => {
  //   item = { ...item, _selected: true };
  //   this.state.datas.map((v, i) => {
  //     if (i == index) v._selected = true;
  //     else v._selected = false;
  //   })
  //   this.setState({ bill: { ...item } })
  // }

  onCardClick = (dataId) => {
    let { selectedIds } = this.state;
     // Console(dataId);
    let idx = selectedIds.indexOf(dataId);
    if (idx > -1) {
      selectedIds.splice(idx, 1)
      this.setState({ selectedIds: selectedIds, showEditBtn: false });
    } else {
      this.setState({ selectedIds: [...selectedIds, dataId], showEditBtn: false });
    }
  }

  handleQry = (v) => {
    this.query(v.detail.value, false)
  }

  onShareAppMessage(res){
    if(res.from==='button'){
      console.log("来自页面内转发按钮");
    }
      return{
      title:'追溯一点通应用分享',
      path:'/pages/share/item?id='+ this.state.shareId+'&tenancyId='+this.state.tenancyId+'&titlename='+ this.state.formName,
      success: (res) => {
       console.log("转发成功",res);
     },
     fail: (res) => {
       console.log("转发失败",res.errMsg);
     }
    }
  }

  handleLoadMore = () => {
    this.state.pageNum = this.state.pageNum + 1;
    this.setState({ loadStatus: 'loading' })
    this.query(this.state.qryStr, true);
  }
  // handShareOnClick = () =>{
  //   if(this.state.selectedIds.length>1){
  //     pathStr='请勿选择多条数据';
  //     return;
  //   }else if(this.state.selectedIds.length===0){
  //     pathStr='请选择需要分享的数据';
  //     return;
  //   }
  //   this.setState({ showEditBtn: false, showEditForm: true, curOperate: v })
  // }
  render() {
    const { datas, showEditBtn, showEditForm, fields, selectedIds, operates, curOperate, formId, qryStr,tenancyId,shareId} = this.state;
    return (
      <View>
          {/*  <Button open-type='share' data-name="pageShare">分享</Button> */}
        <AtSearchBar value={qryStr} onActionClick={this.handleQry.bind(this)} onConfirm={this.handleQry.bind(this)} />
        {
          datas.items.map((v, i) => {
            return <View className={'item ' + (selectedIds.includes(v._id) ? 'selected' : '')}><AtCard
              id={v._id}
              title={v[fields[0].dataIndex]}

              onClick={this.onCardClick.bind(this, v._id)}
            >
              {fields.map((f) => {
                return <View>{f.name + ':' + v[f.dataIndex]}</View>
              })}
            </AtCard> </View>
          })
        }
        {/* {
          datas.items.length == 0 ? <View><span>暂无可查看的数据！</span></View> : ''
        } */}
        <AtLoadMore
          onClick={this.handleLoadMore.bind(this)}
          status={this.state.loadStatus}
        />
        <AtDivider />
        <AtTabBar
          fixed
          tabList={[
            // { title: '添加', iconType: 'add' },
            { title: '操作', iconType: 'check' },
            // { title: '详情', iconType: 'check' }
          ]}
          onClick={this.handleBarClick.bind(this)}
          current={this.state.clickBtn}
        />
        <AtFloatLayout isOpened={showEditBtn} title="操作">
          <View className='at-row at-row--wrap'>
            {operates.map(v => {
              return <View className='at-col at-col-4'><AtButton type='primary' customStyle={{ margin: '5px' }} onClick={this.handleOperateClick.bind(this, v)}>{v.name}</AtButton></View>
            })}
          </View>
        </AtFloatLayout>
        <AtDrawer show={showEditForm} mask right width='100%'>
          <View>
            {showEditForm ? <EditItem formId={formId} operate={curOperate} selectedIds={selectedIds}  formName={this.state.formName}
            Close={this.handleEditFormClose.bind(this)}></EditItem> : ''}
          </View>
        </AtDrawer>
      </View >
    )
  }
}
