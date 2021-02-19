import { forwardRef, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { join } from "path";
import { ParseInstaAccountDto } from "../insta/dto/parse.insta.account.dto";
const puppeteer = require('puppeteer');
import { InstaService } from '../insta/insta.service';
import { IgApiClient } from 'instagram-private-api';
import { CryptService } from "../insta/crypt.service";
import { ConfigService } from "@nestjs/config";
import inquirer = require('inquirer');
import { throwError } from "rxjs";

export class PuppeteerService {

    constructor (@Inject(forwardRef(() => InstaService)) private instaService: InstaService, private cryptService: CryptService, private configService: ConfigService) {}

    async parseAccountApi(_id: object, code: any) {

        const account = await this.instaService.findById(_id);
        console.log(code);

        if(account) {
            const ig = new IgApiClient();
            ig.state.generateDevice(account.nickname);
            try {
                const passwordAccount = await this.cryptService.decryptFunc(account.password);
                const loggedInUser = await ig.account.login(account.login, passwordAccount);
                if(loggedInUser.pk) {
                    account.profile_avatar_url = loggedInUser.profile_pic_url;
                    account.profile_url = `https://instagram.com/${loggedInUser.username}`
                    account.profile_name = loggedInUser.full_name;
                    account.profile_nickname = loggedInUser.username;
                    account.profile_number  = loggedInUser.phone_number;
                    await account.save();
                }
            } catch (e) {

                console.log(ig.state.checkpoint);
                console.log('this code', code);

                await ig.challenge.auto(true);

                if(ig.state.checkpoint.message && !code) {
                    throw 'challenge_required';
                }

                if(ig.state.checkpoint.message && code) {
                    // const r = await ig.challenge.sendSecurityCode(code)
                    console.log('code action');
                    const t = await ig.challenge.sendSecurityCode(code);
                    console.log(t);
                    if(t.logged_in_user) {
                        account.profile_avatar_url = t.logged_in_user.profile_pic_url;
                        account.profile_url = `https://instagram.com/${t.logged_in_user.username}`
                        account.profile_name = t.logged_in_user.full_name;
                        account.profile_nickname = t.logged_in_user.username;
                        account.profile_number  = t.logged_in_user.phone_number;
                        await account.save();
                        return {result: true};
                    }
                    else {
                        console.log('step 2');
                        console.log(e);
                        throw new Error(e);
                    }
                }
                console.log('step 3');
                console.log(e);
                throw new Error(e);
            }
            return {result: true};
        }

        else {
            console.log('account false');
            return {result: true};
        }


    }

    async findUserByName(name: string): Promise<any> {

        name = name.replace(/\s/g, '');
        const instaLogin = await this.configService.get<string>('INSTA_LOGIN');
        const instaPassword = await this.configService.get<string>('INSTA_PASSWORD');
        const instaName = await this.configService.get<string>('INSTA_NAME');
        const ig = new IgApiClient();
        await ig.state.generateDevice(instaName);
        const loggedInUser = await ig.account.login(instaLogin, instaPassword);
        const user_search = await ig.user.search(name.trim());

        const user  =  user_search.users.filter(user => user.username.toString() === name.toString())[0];
        return user;

    }

    async addBestFreind(_id: object, login: string) {

        const account = await this.instaService.findById({_id});
        if(account) {
            const ig = new IgApiClient();
            try {
                await ig.state.generateDevice(account.profile_nickname);
                const loggedInUser = await ig.account.login(account.login, await this.cryptService.decryptFunc(account.password));
                const userId = await ig.user.getIdByUsername(login);
                await ig.friendship.setBesties({add: [userId]})
            } catch (e) {
                throw new Error(e);
            }
        }
        return true;
    }

    async unSubscribeUser(nickname: string, account: object): Promise<any> {

        const accountFound =  await this.instaService.findById({_id: account});
        try {
            if(accountFound) {
                const ig = new IgApiClient();
                await ig.state.generateDevice(accountFound.profile_nickname);
                    const loggedInUser = await ig.account.login(accountFound.login, await this.cryptService.decryptFunc(accountFound.password));
                    if(loggedInUser) {
                        const userId = await ig.user.getIdByUsername(nickname);
                        await ig.friendship.setBesties({remove: [userId]})
                    }
            }
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }
}