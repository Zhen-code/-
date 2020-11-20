import OSS from 'ali-oss';
import axios from 'axios';

const domain = 'http://dev.delevin.beiru168.com';
const localDomain = 'http://localhost:8080';
const Upload_API = {
    uuid: '/oss/v1/uuid',
    sts: '/admin/access/v1/sts',
};

let upload = (type,file,token,fileType='image')=>{
    token = 'token-oqlyYHlJfEWtgMrmNWhkjSCUQLiOAjlCUOkmBknqdWgameZz';
    return new Promise((resolve,reject)=>{
        let client;
        let name;
        let local = sessionStorage.getItem('local');
        let _domain = domain;
        if(local){
            _domain = localDomain
        }
        axios({
            url: _domain+Upload_API.uuid,
            method: 'GET'
        }).then(rsp=>{
            console.log(rsp)
            console.log('uuid')
            let res = rsp.data;
            if(res.code === 200){
                let key = res.data;
                axios({
                    url: _domain+Upload_API.sts,
                    method: 'GET',
                    headers:{
                        Authorization: token
                    }
                }).then(rsp=>{
                    let res = rsp.data;
                    console.log(res);
                    console.log('sts');
                    if(res.code === 200){
                        client = new OSS({
                            accessKeyId: res.data.sts.accessKeyId,
                            accessKeySecret: res.data.sts.accessKeySecret,
                            stsToken: res.data.sts.securityToken,
                            region: 'oss-cn-hangzhou',
                            bucket: res.data.bucket
                        });
                        if(fileType === 'image'){
                            name = res.data.prefix + '/' + key + '.' + type;
                        }else{
                            name = res.data.prefix + '/' + key + '/' + file.name;
                        }
                        client.put(name,file).then(response=>{
                            resolve(response)
                        }).catch(error=>{
                            reject(error)
                        })
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }).catch(error=>{
            console.log(error)
        })
    })
};
export default upload




