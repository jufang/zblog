import client from "axios";
import { CMS_ROOT_URL } from 'shared/constants/apis';
import  { getCSRFToken, capitalize } from 'shared/utilities';
var omit =require('lodash/omit')

export const axios = client.create({
  baseURL: CMS_ROOT_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCSRFToken()
  }
});

export function createAuthorizedRequest(method, path, params) {
  const config = { headers: { 'Authorization': localStorage.getItem('accessToken') } };
  switch(method) {
    case 'get':
      return axios.get(path, config);
    case 'post':
      return axios.post(path, params, config);
    case 'patch' :
      return axios.patch(path, params, config);
    case 'delete' :
      return axios.delete(path, config);
  }
}


export function trimPost(params) {
  return {
    ...convertKeyNameInSnakeCase(params),
    items_attributes:
      params.itemsAttributes
        .filter(item => !item.editing)
        .map(item => convertKeyNameInSnakeCase(item))
  };
}

export function trimAuthor(params) {
  return {
    ...convertKeyNameInSnakeCase(params)
  };
}


const unusedProps = [
  ["initialValue", "autofill", "onUpdate", "valid", "invalid", "dirty", "pristine","error", "active", "touched", "visited", "autofilled"],
  ["initialValue", "autofill", "onUpdate", "valid", "invalid", "dirty", "pristine", "active", "touched", "visited", "autofilled"]
]

export function deleteUnusedProps(data,index){
  return omit(data, unusedProps[index])
}
