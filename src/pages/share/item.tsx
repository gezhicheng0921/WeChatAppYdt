import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtInput, AtButton, AtDivider, AtMessage，AtNoticebar,AtCard  } from 'taro-ui'
import * as formSvr from '../../services/form'
import { set as globalset, get as globalget, CONSTS, getHeader } from '../../global_data.js'
import './item.scss'


    
  
export default class item extends Component {
    state = {
        formId:'',
        selectedIds:'',
        parsFormId:'',
        fields:[],
        operate: { name: '', typeId: '', apiAddress: '' },//当前操作
        showItem:{},
        editItem:{},
        shareId:'666',
        datas: { totalCount: 0, items: [] },
      }
      //初次进入获取携带参数 
      componentWillMount() {

      //  this.state.shareId = this.$router.params.id;//通过查询字符串获取formid
      //this.state.shareId='跑得快';

    //  const titlename=this.$router.params.titlename;
    const titlename='代办任务';
       const tenancyId=this.$router.params.tenancyId;
       this.state.shareId=this.$router.params.id;
      //  const selectedIds=["7a9248e5-ebae-44ec-b406-03176c34cc90"];
        formSvr.qryShareData( this.state.shareId,tenancyId).then((res) => {
          const data = res.data.result;
          this.state.fields = data.fields;
          let items = data.datas.items;
          this.state.showItem = items[0];//展示第一条数据
          this.setState({  datas: data.datas })
        }).catch(err => console.log(err))
        Taro.setNavigationBarTitle({ title:titlename})
      }
    render(){

        const { shareId,showItem,fields} = this.state;
        return (
       // 
          <View>
              { fields.map((f) => {
                //    console.log(f.name+':'+key[f.dataIndex]);
                    //  return <AtInput disabled title={f.name} type='text' value= { showItem[f.dataIndex]}/>
                     return  <View>
                               <span>
                                  {f.name+':'+showItem[f.dataIndex]}
                            </span>
                                <br/>
                        </View>
                 //  return <View> {f.name+':'+showItem[f.dataIndex]}</View>
              })}
          </View>
       
        )
    }
}