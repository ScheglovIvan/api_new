import { UserService } from './user.service';
import { InstaService } from '../insta/insta.service';
import { CustomerSubscribeDto } from './customer/dto/customer.subsctibe.dto';
import { CustomerService } from './customer/user.customer.service';
import { PuppeteerService } from '../parse/parse.service';
import { StatsService } from '../statistic/stats.service';
import { ChangePasswordDto } from './dto/user.passchange.dto';
export declare class UserController {
    private userService;
    private customerService;
    private instaService;
    private parseService;
    private statService;
    constructor(userService: UserService, customerService: CustomerService, instaService: InstaService, parseService: PuppeteerService, statService: StatsService);
    createPaymentPage(req: any, { name }: {
        name: any;
    }): Promise<any>;
    renderSuccessSubscribe(): Promise<{
        bodyClass: string;
    }>;
    renderSettings(req: any, resp: any): Promise<any>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto, session: any): Promise<any>;
    renderCustomerList(req: any, resp: any, page: number): Promise<object>;
    subscribeUser(customerSubscribeDto: CustomerSubscribeDto, resp: any): Promise<any>;
    subscribeUserTest(CustomerSubscribeDto: CustomerSubscribeDto, resp: any): Promise<any>;
    unsubscribeTest(nickname: string, account: object): Promise<any>;
    unsubscribeRender(id: any): Promise<void>;
    renderRecovery(): Promise<{}>;
    recoveryPassword(body: any, resp: any): Promise<any>;
    cancelSubsctibe(query: any, resp: any): Promise<any>;
    renderCancelSuccess(): Promise<{}>;
}
