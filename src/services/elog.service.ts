import {Request} from '@loopback/rest';
import axios from 'axios';
import ip from 'ip';
import {ElogOptions, Logger, LogMetadata, TokenRepository} from '../types';


type Infomation = {
  key: string,
  value: string
}

type TimeLine = {
  isSend?: boolean,
  timestamp?: Date,
  order?: number,
  content?: string,
  status?: boolean,
  file?: {
    name: string,
    base64: string
  }
}

type Diary = {
  ipServer?: string
  ipClient?: string
  type?: string
  description?: string
  status?: boolean
  resultCode?: string
  information?: Infomation[]
  timelines?: TimeLine[]
  isDone?: boolean | string
  fnInfo?: {
    code: string,
    name: string
  }
}

export class ElogService implements Logger {
  protected url: string
  protected username: string
  protected password: string
  protected appcode: string

  private logId = '';
  private token = '';
  private type = 'THUONG';
  private description = '';
  private informations: Infomation[] = [];
  private status: boolean | null = null;
  private timelines: TimeLine[] = [];
  private resultCode = '';
  private ipServer = '';
  private ipClient = '';
  private isDone: string | boolean = false;
  private functionCode = '';
  private functionName = '';
  private hasChange = false;
  private timeLineOrder = 0;

  constructor(options: ElogOptions, private tokenRepo: TokenRepository) {
    this.url = options.url
    this.username = options.username
    this.password = options.password
    this.appcode = options.appCode
  }

  async login() {
    const data = {
      apiUser: this.username,
      apiPassword: this.password,
      appCode: this.appcode
    }
    try {
      const res = await axios.post(`${this.url}/applications/login`, data)
      this.token = res.data.token
      const token = await this.tokenRepo.findOne({where: {username: this.username}})
      if (token) {
        token.token = this.token
        this.tokenRepo.save(token).then(() => { }, e => console.log(e));
      } else {
        await this.tokenRepo.create({
          username: this.username,
          token: this.token
        })
      }
    } catch (error) {
      return false
    }
  }

  async log(metaData: LogMetadata, request: Request, reqData: any, result: any, status: boolean) {
    if (status === false) {
      this.setStatus(status)
      if (typeof result === 'object') {
        const _jsonStr = JSON.stringify(result);
        const _content = _jsonStr.substring(0, 1000);
        this.addTimeLine(_content, false);
      } else {
        this.addTimeLine(result.substring(0, 1000), false);
      }
    }
    const {parseInfo, parseResult, fn, priorityLevel, description} = metaData
    if (description) {
      this.setDescription(`${description} ${this.description}`)
    }
    if (parseInfo) {
      const infos = parseInfo(reqData)
      if (infos) {
        const keyInfos = Object.keys(infos)
        keyInfos.forEach(key => {
          if (infos[key]) {
            this.addObjectInfo(key, infos[key].toString())
          }
        })
      }
    }

    const {status: resutlStatus, resultCode, result: resResult} = parseResult(result);
    this.setResultCode(resultCode);
    if (this.status === null) {
      if (resutlStatus !== undefined) {
        this.setStatus(resutlStatus);
      } else {
        this.setStatus(status)
      }
      const _jsonStr = JSON.stringify(resResult);
      const _content = _jsonStr.substring(0, 1000);
      this.addTimeLine(_content, resutlStatus)
    }

    if (priorityLevel) {
      this.setType(priorityLevel)
    }
    this.setDone()
    this.setFunction(fn.code, fn.name)
    this.setIpServer(ip.address())
    let ipClient = '';
    if (request.headers['x-forwarded-for'] && request.headers['x-forwarded-for'] !== '') {
      const ips = request.headers['x-forwarded-for'].toString().split(',');
      ipClient = ips[0];
    }
    if (ipClient === "" && (request.ip === '::1' || request.ip === '::ffff:' || request.ip === '::ffff:127.0.0.1')) {
      ipClient = '127.0.0.1'
    }
    if (ipClient === "" && !(request.ip === '::1' || request.ip === '::ffff:' || request.ip === '::ffff:127.0.0.1')) {
      ipClient = request.ip.toString();
    }
    this.setIpClient(ipClient)
    this.createLog().then(() => { }, e => console.log(e));
  }

  setChange(change = true) {
    this.hasChange = change
  }

  setDone() {
    if (this.isDone !== "lock") {
      this.isDone = true
      this.setChange()
    }
  }

  setFunction(functionCode: string, functionName: string) {
    this.functionCode = functionCode
    this.functionName = functionName
    this.setChange()
  }

  setResultCode(resultCode: string) {
    this.resultCode = resultCode;
    this.setChange();
  }

  setStatus(status: boolean) {
    this.status = status;
    this.setChange();
  }

  setType(type: string) {
    this.type = type;
    this.setChange();
  }

  setDescription(description: string) {
    this.description = description;
    this.setChange();
  }

  setIpServer(_ip: string) {
    this.ipServer = _ip
    this.setChange()
  }

  setIpClient(_ip: string) {
    this.ipClient = _ip
    this.setChange()
  }

  addDescription(str: string) {
    if (!this.description) {
      this.description = str;
    } else {
      this.description += `; ${str}`
    }
  }

  addObjectInfo(key: string, value: string) {
    this.informations = [...this.informations, {key, value}]
    this.setChange();
  }

  addTimeLine(content: string, status = true, fileName = '', base64FileContent = '') {
    this.timeLineOrder++;
    const timeLineData: TimeLine = {
      isSend: false,
      status,
      order: this.timeLineOrder,
    }
    if (content) {
      timeLineData.content = content
    }
    if (fileName) {
      timeLineData.file = {
        name: fileName,
        base64: base64FileContent
      }
    }
    this.timelines = [...this.timelines, timeLineData]
  }

  async post(data: object, apiName: string): Promise<any> {
    try {
      await this.getToken()
      if (this.token) {
        const res = await axios.post(`${this.url}${apiName}`, data, {headers: {Authorization: `Bearer ${this.token}`}})
        return res.data
      } else {
        return false;
      }
    } catch (error) {
      if (error.response.status === 401) {
        await this.clearToken();
        return await this.post(data, apiName);
      }
      return false;
    }
  }

  /**
     * Create patch request
     */
  async patch(data: object, apiName: string): Promise<any> {
    try {
      await this.getToken()
      if (this.token) {
        const res = await axios.patch(`${this.url}${apiName}`, data, {headers: {Authorization: `Bearer ${this.token}`}})
        return res.data
      } else {
        return false;
      }
    } catch (error) {
      if (error.response.status === 401) {
        await this.clearToken();
        return await this.patch(data, apiName);
      }
      return false;
    }
  }

  createLogDataRequest() {
    const data: Diary = {}
    if (this.ipServer) {
      data.ipServer = this.ipServer
    }
    if (this.ipClient) {
      data.ipClient = this.ipClient
    }
    if (this.type) {
      data.type = this.type
    }
    if (this.description) {
      data.description = this.description
    }
    if (this.status !== null) {
      data.status = this.status
    }
    if (this.resultCode) {
      data.resultCode = this.resultCode.toString()
    }
    if (!this.isDone && this.isDone !== "lock") {
      data.isDone = this.isDone
      this.isDone = "lock"
    } else if (this.isDone === true) {
      data.isDone = true
    }
    if (this.informations && this.informations.length > 0) {
      data.information = this.informations
    }
    if (this.functionCode) {
      data.fnInfo = {
        code: this.functionCode,
        name: this.functionName
      }
    }
    return data
  }

  async createLog() {
    if (this.functionCode) {
      const data = this.createLogDataRequest()
      const result = await this.post(data, '/diaries')
      if (result) {
        this.logId = result.id
        this.pushTimeLine().then(() => { }, e => console.log(e));
        this.setChange(false)
      }
    }
    return false
  }

  async pushTimeLine() {
    const timeLineData: TimeLine = {}
    if (this.logId && this.timelines && this.timelines.length > 0) {
      for (let i = 0; i < this.timelines.length; i++) {
        if (!this.timelines[i].isSend) {
          if (this.timelines[i].content) {
            timeLineData.content = this.timelines[i].content?.toString()
          }
          if (this.timelines[i].status !== null) {
            timeLineData.status = this.timelines[i].status;
          }
          if (this.timelines[i].file) {
            timeLineData.file = this.timelines[i].file
          }
          if (this.timelines[i].timestamp) {
            timeLineData.timestamp = this.timelines[i].timestamp
          }
          if (this.timelines[i].order) {
            timeLineData.order = this.timelines[i].order
          }
          const result = await this.post(timeLineData, `/diaries/${this.logId}/timelines`)
          if (result) {
            this.timelines[i].isSend = true
          }
        }
      }
    }
  }

  async updateLog() {
    if (this.hasChange) {
      const data = this.createLogDataRequest()
      const result = await this.patch(data, `/diaries/${this.logId}`)
      if (result) {
        this.pushTimeLine();
        this.setChange(false)
      }
    }
  }

  push() {
    if (this.logId) {
      this.updateLog()
    } else {
      this.createLog()
    }
  }

  async getToken() {
    if (!this.token) {
      const token = await this.tokenRepo.findOne({where: {username: this.username}})
      const tokenKey: string = token ? token.token ?? '' : ''
      if (!tokenKey) {
        await this.login()
        const token = await this.tokenRepo.findOne({where: {username: this.username}})
        if (!token) {
          return false
        }
        this.token = token.token ?? ''
        return this.token
      }
      this.token = tokenKey
      return this.token
    } else {
      return this.token
    }
  }

  async clearToken() {
    await this.tokenRepo.deleteAll({username: this.username})
    this.token = ''
  }

  async pushNewTimeLine(content: string, status = true) {
    this.timeLineOrder++;
    const timeLineData: TimeLine = {
      status,
      order: this.timeLineOrder,
    }
    if (content) {
      timeLineData.content = content
    }
    if (this.logId) {
      await this.post(timeLineData, `/diaries/${this.logId}/timelines`)
    }
  }

  getIsDone() {
    return this.isDone;
  }

  getStatus() {
    return this.status;
  }

  getResultCode() {
    return this.resultCode;
  }

  getLogId() {
    return this.logId;
  }
}
