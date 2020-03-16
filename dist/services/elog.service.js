"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const ip_1 = tslib_1.__importDefault(require("ip"));
class ElogService {
    constructor(options, tokenRepo) {
        this.tokenRepo = tokenRepo;
        this.logId = '';
        this.token = '';
        this.type = 'THUONG';
        this.description = '';
        this.informations = [];
        this.status = null;
        this.timelines = [];
        this.resultCode = '';
        this.ipServer = '';
        this.ipClient = '';
        this.isDone = false;
        this.functionCode = '';
        this.functionName = '';
        this.hasChange = false;
        this.timeLineOrder = 0;
        this.url = options.url;
        this.username = options.username;
        this.password = options.password;
        this.appcode = options.appCode;
    }
    async login() {
        const data = {
            apiUser: this.username,
            apiPassword: this.password,
            appCode: this.appcode
        };
        try {
            const res = await axios_1.default.post(`${this.url}/applications/login`, data);
            this.token = res.data.token;
            const token = await this.tokenRepo.findOne({ where: { username: this.username } });
            if (token) {
                token.token = this.token;
                this.tokenRepo.save(token);
            }
            else {
                await this.tokenRepo.create({
                    username: this.username,
                    token: this.token
                });
            }
        }
        catch (error) {
            return false;
        }
    }
    async log(metaData, request, reqData, result, status) {
        if (status === false) {
            this.setStatus(status);
            if (typeof result === 'object') {
                this.addTimeLine('result', false, 'result.json', Buffer.from(JSON.stringify(result), 'utf8').toString('base64'));
            }
            else {
                this.addTimeLine('result', false, 'result.txt', Buffer.from(result, 'utf8').toString('base64'));
            }
        }
        const { parseInfo, parseResult, fn, priorityLevel, description } = metaData;
        if (description) {
            this.setDescription(`${description} ${this.description}`);
        }
        if (parseInfo) {
            const infos = parseInfo(reqData);
            if (infos) {
                const keyInfos = Object.keys(infos);
                keyInfos.forEach(key => {
                    if (infos[key]) {
                        this.addObjectInfo(key, infos[key].toString());
                    }
                });
            }
        }
        const { status: resutlStatus, resultCode, result: resResult } = parseResult(result);
        this.setResultCode(resultCode);
        if (this.status === null) {
            if (resutlStatus !== undefined) {
                this.setStatus(resutlStatus);
            }
            else {
                this.setStatus(status);
            }
            this.addTimeLine('result', resutlStatus, 'result.json', Buffer.from(JSON.stringify(resResult), 'utf8').toString('base64'));
        }
        if (priorityLevel) {
            this.setType(priorityLevel);
        }
        this.setDone();
        this.setFunction(fn.code, fn.name);
        this.setIpServer(ip_1.default.address());
        this.setIpClient(request.ip === '::1' ? '127.0.0.1' : request.ip);
        this.createLog();
    }
    setChange(change = true) {
        this.hasChange = change;
    }
    setDone() {
        if (this.isDone !== "lock") {
            this.isDone = true;
            this.setChange();
        }
    }
    setFunction(functionCode, functionName) {
        this.functionCode = functionCode;
        this.functionName = functionName;
        this.setChange();
    }
    setResultCode(resultCode) {
        this.resultCode = resultCode;
        this.setChange();
    }
    setStatus(status) {
        this.status = status;
        this.setChange();
    }
    setType(type) {
        this.type = type;
        this.setChange();
    }
    setDescription(description) {
        this.description = description;
        this.setChange();
    }
    setIpServer(ip) {
        this.ipServer = ip;
        this.setChange();
    }
    setIpClient(ip) {
        this.ipClient = ip;
        this.setChange();
    }
    addDescription(str) {
        if (!this.description) {
            this.description = str;
        }
        else {
            this.description += `; ${str}`;
        }
    }
    addObjectInfo(key, value) {
        this.informations = [...this.informations, { key, value }];
        this.setChange();
    }
    addTimeLine(content, status = true, fileName = '', base64FileContent = '') {
        this.timeLineOrder++;
        const timeLineData = {
            isSend: false,
            status,
            order: this.timeLineOrder,
        };
        if (content) {
            timeLineData.content = content;
        }
        if (fileName) {
            timeLineData.file = {
                name: fileName,
                base64: base64FileContent
            };
        }
        this.timelines = [...this.timelines, timeLineData];
    }
    async post(data, apiName) {
        try {
            await this.getToken();
            if (this.token) {
                const res = await axios_1.default.post(`${this.url}${apiName}`, data, { headers: { Authorization: `Bearer ${this.token}` } });
                return res.data;
            }
            else {
                return false;
            }
        }
        catch (error) {
            if (error.response.status === 401) {
                await this.clearToken();
                return this.post(data, apiName);
            }
            return false;
        }
    }
    /**
       * Create patch request
       */
    async patch(data, apiName) {
        try {
            await this.getToken();
            if (this.token) {
                const res = await axios_1.default.patch(`${this.url}${apiName}`, data, { headers: { Authorization: `Bearer ${this.token}` } });
                return res.data;
            }
            else {
                return false;
            }
        }
        catch (error) {
            if (error.response.status === 401) {
                await this.clearToken();
                return this.patch(data, apiName);
            }
            return false;
        }
    }
    createLogDataRequest() {
        const data = {};
        if (this.ipServer) {
            data.ipServer = this.ipServer;
        }
        if (this.ipClient) {
            data.ipClient = this.ipClient;
        }
        if (this.type) {
            data.type = this.type;
        }
        if (this.description) {
            data.description = this.description;
        }
        if (this.status !== null) {
            data.status = this.status;
        }
        if (this.resultCode) {
            data.resultCode = this.resultCode.toString();
        }
        if (!this.isDone && this.isDone !== "lock") {
            data.isDone = this.isDone;
            this.isDone = "lock";
        }
        if (this.informations && this.informations.length > 0) {
            data.information = this.informations;
        }
        if (this.functionCode) {
            data.fnInfo = {
                code: this.functionCode,
                name: this.functionName
            };
        }
        return data;
    }
    async createLog() {
        if (this.functionCode) {
            const data = this.createLogDataRequest();
            const result = await this.post(data, '/diaries');
            if (result) {
                this.logId = result.id;
                this.pushTimeLine();
                this.setChange(false);
            }
        }
        return false;
    }
    async pushTimeLine() {
        var _a;
        let timeLineData = {};
        if (this.logId && this.timelines && this.timelines.length > 0) {
            for (let i = 0; i < this.timelines.length; i++) {
                if (!this.timelines[i].isSend) {
                    if (this.timelines[i].content) {
                        timeLineData.content = (_a = this.timelines[i].content) === null || _a === void 0 ? void 0 : _a.toString();
                    }
                    if (this.timelines[i].status !== null) {
                        timeLineData.status = this.timelines[i].status;
                    }
                    if (this.timelines[i].file) {
                        timeLineData.file = this.timelines[i].file;
                    }
                    if (this.timelines[i].timestamp) {
                        timeLineData.timestamp = this.timelines[i].timestamp;
                    }
                    if (this.timelines[i].order) {
                        timeLineData.order = this.timelines[i].order;
                    }
                    const result = await this.post(timeLineData, `/diaries/${this.logId}/timelines`);
                    if (result) {
                        this.timelines[i].isSend = true;
                    }
                }
            }
        }
    }
    async updateLog() {
        if (this.hasChange) {
            const data = this.createLogDataRequest();
            const result = await this.patch(data, `/diaries/${this.logId}`);
            if (result) {
                this.pushTimeLine();
                this.setChange(false);
            }
        }
    }
    push() {
        if (this.logId) {
            this.updateLog();
        }
        else {
            this.createLog();
        }
    }
    async getToken() {
        if (!this.token) {
            let token = await this.tokenRepo.findOne({ where: { username: this.username } });
            let tokenKey = token ? token.token || '' : '';
            if (!tokenKey) {
                await this.login();
                let token = await this.tokenRepo.findOne({ where: { username: this.username } });
                if (!token) {
                    return false;
                }
                this.token = token.token || '';
                return this.token;
            }
            this.token = tokenKey;
            return this.token;
        }
        else {
            return this.token;
        }
    }
    async clearToken() {
        await this.tokenRepo.deleteAll({ username: this.username });
        this.token = '';
    }
}
exports.ElogService = ElogService;
//# sourceMappingURL=elog.service.js.map