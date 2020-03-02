import { CONSTS, getHeader } from '../global_data'
import Taro, { arrayBuffer } from '@tarojs/taro'

export async function add(formId, item) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/app/FormData/Create2',
    data: {
      para: {
        formId: formId,
        ...item
      }
    },
    method: 'POST',
    header: getHeader()
  })
}

export async function edit(formId, id, item) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/app/FormData/Update2',
    data: {
      para: {
        formId: formId,
        ...item,
        _id: id
      }
    },
    method: 'PUT',
    header: getHeader()
  })
}

export async function operate(operate, formId, ids, item) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/app/FormData/Operate',
    data: {
      _formId: formId,
      _dataId: ids,
      _msgId: '',
      _operateId: operate.id,
      _operateName: operate.name,
      _pars: item
    },
    method: 'POST',
    header: getHeader()
  })
}
//查询数据
//columnList示例：[{id:'列的id',value:['查询字符串数组'],isReverse:是否反向查询,lableType:'Filter'}]
export async function query(formId: string, columnList: Array<string>, pageNumber: Number) {
  return Taro.request({
    url: CONSTS.ServiceURL +'/app/DataFilter/Query',
    data: {
      formId: formId,
      columnList: columnList,
      pageNumber: pageNumber,
      pageSize: 10,
    },
    method: 'POST',
    header: getHeader()
  })
}
//分项数据查询
export async function qryShareData(shareId: string,tenancyId:string) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/api/Services/app/Share/ShareQuery',
    data: {
      id: shareId,
      TenantId:tenancyId
    },
    method: 'POST',
    header: getHeader()
  })
}
//分项数据创建
//（对象传FormId(表单的Id),Filters(查询条件),TopRow(检测top行数，返回所有可传0),RelaFormIds是数组,占不传）RelaFormId:Array<string>
export async function shareCreate(formId:string,dataId:string,TopRow:Number){
  return Taro.request({
    url:CONSTS.ServiceURL+'/api/Services/app/Share/Create',
    data:{
      formId:formId,
      dataId:dataId,
      TopRow:TopRow
    },
    method:'POST',
    header:getHeader()
  })
}
export async function shareCreateTest(formId:string,dataIds:Array<string>,TopRow:Number){
  return Taro.request({
    url:CONSTS.ServiceURL+'/api/Services/app/Share/Create',
    data:{
      formId:formId,
      dataIds:dataIds,
      TopRow:TopRow
    },
    method:'POST',
    header:getHeader()
  })
}

//查询数据并返回列头
export async function queryByIdAndReturnField(formId: string, ids: Array<string>) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/app/DataFilter/QueryAndReturnField',
    data: {
      formId: formId,
      ids: ids,
      pageNumber: 1,
      pageSize: 10,
    },
    method: 'POST',
    header: getHeader()
  })
}

//查询数据并返回列头
//columnList示例：[{id:'列的id',value:['查询字符串数组'],isReverse:是否反向查询,lableType:'Filter'}]
export async function queryByClmAndReturnField(formId: string, columnList: Array<string>) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/app/DataFilter/QueryAndReturnField',
    data: {
      formId: formId,
      columnList: columnList,
      pageNumber: 1,
      pageSize: 10,
    },
    method: 'POST',
    header: getHeader()
  })
}

//查询表单所有操作
export async function qryOperates(formId: string) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/app/FormOperate/QryFormOperateALL',
    data: { formId: formId },
    method: 'POST',
    header: getHeader()
  })
}

//查询关联表单
export async function qryRelaForm(formId: string) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/app/FormData/QryFormDataRelaTable',
    data: { formId: formId },
    method: 'POST',
    header: getHeader()
  })
}

//获取选择项数据源
export async function getSelectSrc(fieldId: string, qryStr: string) {
  return Taro.request({
    url: CONSTS.ServiceURL + '/app/Select/GetSrc?fieldId=' + fieldId + '&qryStr=' + qryStr,
    header: getHeader()
  })
}


