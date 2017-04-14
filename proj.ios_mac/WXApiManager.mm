//
//  WXApiManager.m
//  SDKSample
//
//  Created by Jeason on 16/07/2015.
//
//

#import "WXApiManager.h"
#import "js_manual_conversions.h"

#import "ScriptingCore.h"

@implementation WXApiManager

#pragma mark - LifeCycle
+(instancetype)sharedManager {
    static dispatch_once_t onceToken;
    static WXApiManager *instance;
    dispatch_once(&onceToken, ^{
        instance = [[WXApiManager alloc] init];
    });
    return instance;
}

#pragma mark - WXApiDelegate
- (void)onResp:(BaseResp *)resp {
    NSLog(@"------ onResp--------------");
    
    SendAuthResp *authResp =(SendAuthResp *)resp;
    NSString *strMsg0 =[NSString stringWithFormat:@"code:%@,state:%@,errCode:%d",authResp.code,authResp.state,authResp.errCode];
    NSLog(@"%@",strMsg0);
    
    NSString *func =[NSString stringWithFormat:@"require('GameLogin').GameLoginOcCallJs('%@')",authResp.code];
    
    const char *stringFunc =[func UTF8String];
    JS::MutableHandleValue *outval;
    ScriptingCore ::getInstance()->evalString(stringFunc,*outval);
    
    
}

- (void)onReq:(BaseReq *)req {
    if ([req isKindOfClass:[GetMessageFromWXReq class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvGetMessageReq:)]) {
            GetMessageFromWXReq *getMessageReq = (GetMessageFromWXReq *)req;
            [_delegate managerDidRecvGetMessageReq:getMessageReq];
        }
    } else if ([req isKindOfClass:[ShowMessageFromWXReq class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvShowMessageReq:)]) {
            ShowMessageFromWXReq *showMessageReq = (ShowMessageFromWXReq *)req;
            [_delegate managerDidRecvShowMessageReq:showMessageReq];
        }
    } else if ([req isKindOfClass:[LaunchFromWXReq class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvLaunchFromWXReq:)]) {
            LaunchFromWXReq *launchReq = (LaunchFromWXReq *)req;
            [_delegate managerDidRecvLaunchFromWXReq:launchReq];
        }
    }
}

+(BOOL) callNativeUIWithTitle:(NSString *) scope andContent:(NSString *) state{
    NSLog(@"----通过微信API 发送请求到微信----");
    SendAuthReq* req=[[[SendAuthReq alloc] init] autorelease];
    req.scope = scope;
    req.state = state;
    
    return [WXApi sendAuthReq:req viewController:NULL delegate:[WXApiManager sharedManager]];
    
}

@end
