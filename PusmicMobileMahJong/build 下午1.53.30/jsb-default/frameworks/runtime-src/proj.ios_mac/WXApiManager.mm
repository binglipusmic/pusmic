//
//  WXApiManager.m
//  SDKSample
//
//  Created by Jeason on 16/07/2015.
//
//

#import "WXApiManager.h"
#import "js_manual_conversions.h"
#import <AVFoundation/AVFoundation.h>
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
AVAudioRecorder *_audioRecorder;
- (void)onResp:(BaseResp *)resp {
    NSLog(@"------ onResp--------------");
    if ([resp isKindOfClass:[SendMessageToWXResp class]]) {
      NSLog(@"------ TEXT onResp--------------");
    } else if ([resp isKindOfClass:[SendAuthResp class]]) {
        SendAuthResp *authResp =(SendAuthResp *)resp;
        NSString *strMsg0 =[NSString stringWithFormat:@"code:%@,state:%@,errCode:%d",authResp.code,authResp.state,authResp.errCode];
        NSLog(@"%@",strMsg0);
        
        if(authResp.errCode==0){
            
            NSString *func =[NSString stringWithFormat:@"cc.find('iniIndex').getComponent('iniIndex').getRequstTokenByCode('%@');",authResp.code];
            const char *stringFunc =[func UTF8String];
            //JS::MutableHandleValue *outval;
            
            ScriptingCore ::getInstance()->evalString(stringFunc);
            
            
            NSLog(@"------ onResp-------------- end");
        }else{
            ScriptingCore::getInstance()->evalString("require('iniIndex').getRequstTokenByCodeOnError()");
        }
    } else if ([resp isKindOfClass:[AddCardToWXCardPackageResp class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvAddCardResponse:)]) {
            AddCardToWXCardPackageResp *addCardResp = (AddCardToWXCardPackageResp *)resp;
            [_delegate managerDidRecvAddCardResponse:addCardResp];
        }
    } else if ([resp isKindOfClass:[WXChooseCardResp class]]) {
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvChooseCardResponse:)]) {
            WXChooseCardResp *chooseCardResp = (WXChooseCardResp *)resp;
            [_delegate managerDidRecvChooseCardResponse:chooseCardResp];
        }
    }else if ([resp isKindOfClass:[WXChooseInvoiceResp class]]){
        if (_delegate
            && [_delegate respondsToSelector:@selector(managerDidRecvChooseInvoiceResponse:)]) {
            WXChooseInvoiceResp *chooseInvoiceResp = (WXChooseInvoiceResp *)resp;
            [_delegate managerDidRecvChooseInvoiceResponse:chooseInvoiceResp];
        }
        
    }
    
    
    
    
 
    
  
    
    
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

+(BOOL) sendAuthRequestWX{
    NSLog(@"----通过微信API 发送请求到微信----");
    SendAuthReq* req=[[[SendAuthReq alloc] init] autorelease];
    req.scope = @"snsapi_userinfo";
    req.state = @"pusmic_game_majhong";
    
    return [WXApi sendAuthReq:req viewController:NULL delegate:[WXApiManager sharedManager]];
    
}

+(BOOL) isWXInstalled

{
      NSLog(@"----isWXInstalled----");
    return [WXApi isWXAppInstalled];
}



//send message to chat inter face.
+(BOOL)sendMessageToFriend:(NSString *)str title:(NSString *)tit{
    //UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:tit message:str delegate:nil cancelButtonTitle:@"否" otherButtonTitles:@"是", nil];
    //[alertView show];
    
//    SendMessageToWXReq* req=[[SendMessageToWXReq alloc] init];
//    req.text=str;
//    req.bText=YES;
//    req.scene=WXSceneSession;
//    return [WXApi sendReq:req];
    //return TRUE;
    
    
    Byte* pBuffer = (Byte *)malloc(BUFFER_SIZE);
    memset(pBuffer, 0, BUFFER_SIZE);
    NSData* data = [NSData dataWithBytes:pBuffer length:BUFFER_SIZE];
    free(pBuffer);
    
    UIImage *thumbImage = [UIImage imageNamed:@"icon.png"];
   
    
    WXAppExtendObject *ext = [WXAppExtendObject object];
    ext.extInfo = str;
    ext.url = @"www.pusmic.com";
    ext.fileData = data;
    NSString *title=@"四川乐乐麻将";
     NSString *strMsgRoom =[NSString stringWithFormat:@"我已在四川乐乐麻将中建好房间【%@】,快来加入吧！ ",str];
    NSString *description=strMsgRoom;
    NSString *kAppMessageExt = @"这是第三方带的测试字段";
    NSString *kAppMessageAction = @"<action>join room</action>";
    WXMediaMessage *message =[WXMediaMessage message];
    message.title=title;
    message.description=description;
    message.mediaObject=ext;
    message.messageExt=kAppMessageExt;
    message.messageAction=kAppMessageAction;
    message.thumbImage=thumbImage;
    message.mediaTagName=@"";
//    
//    [WXMediaMessage messageWithTitle:title
//                                                   Description:description
//                                                        Object:ext
//                                                    MessageExt:kAppMessageExt
//                                                 MessageAction:kAppMessageAction
//                                                    ThumbImage:thumbImage
//                                                      MediaTag:nil];
    
//    SendMessageToWXReq* req = [SendMessageToWXReq requestWithText:nil
//                                                   OrMediaMessage:message
//                                                            bText:NO
//                                                          InScene:WXSceneSession];
     SendMessageToWXReq* req=[[SendMessageToWXReq alloc] init];
    req.bText=NO;
    req.message=message;
    req.scene=WXSceneSession;
    
    return [WXApi sendReq:req];
   
}


+ (BOOL)sendAppContentData:(NSData *)data
                   ExtInfo:(NSString *)info
                    ExtURL:(NSString *)url
                     Title:(NSString *)title
               Description:(NSString *)description
                MessageExt:(NSString *)messageExt
             MessageAction:(NSString *)action
                ThumbImage:(UIImage *)thumbImage
                   InScene:(enum WXScene)scene {
    WXAppExtendObject *ext = [WXAppExtendObject object];
    ext.extInfo = info;
    ext.url = url;
    ext.fileData = data;
    
    WXMediaMessage *message = [WXMediaMessage messageWithTitle:title
                                                   Description:description
                                                        Object:ext
                                                    MessageExt:messageExt
                                                 MessageAction:action
                                                    ThumbImage:thumbImage
                                                      MediaTag:nil];
    
    SendMessageToWXReq* req = [SendMessageToWXReq requestWithText:nil
                                                   OrMediaMessage:message
                                                            bText:NO
                                                          InScene:scene];
    return [WXApi sendReq:req];
    
}


//---------------------------Audio-----------------------------------------------


@end
