//
//  WXApiManager.h
//  SDKSample
//
//  Created by Jeason on 16/07/2015.
//
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "WXApi.h"
#define BUFFER_SIZE 1024 * 100


@protocol WXApiManagerDelegate <NSObject>

@optional

- (void)managerDidRecvGetMessageReq:(GetMessageFromWXReq *)request;

- (void)managerDidRecvShowMessageReq:(ShowMessageFromWXReq *)request;

- (void)managerDidRecvLaunchFromWXReq:(LaunchFromWXReq *)request;

- (void)managerDidRecvMessageResponse:(SendMessageToWXResp *)response;

- (void)managerDidRecvAuthResponse:(SendAuthResp *)response;

- (void)managerDidRecvAddCardResponse:(AddCardToWXCardPackageResp *)response;

- (void)managerDidRecvChooseCardResponse:(WXChooseCardResp *)response;

- (void)managerDidRecvChooseInvoiceResponse:(WXChooseInvoiceResp *)response;
@end

@interface WXApiManager : NSObject<WXApiDelegate>

@property (nonatomic, assign) id<WXApiManagerDelegate> delegate;


+ (instancetype)sharedManager;
+ (BOOL)sendMessageToFriend:(NSString *)str title:(NSString *)tit;
+ (BOOL)sendAppContentData:(NSData *)data
                   ExtInfo:(NSString *)info
                    ExtURL:(NSString *)url
                     Title:(NSString *)title
               Description:(NSString *)description
                MessageExt:(NSString *)messageExt
             MessageAction:(NSString *)action
                ThumbImage:(UIImage *)thumbImage
                   InScene:(enum WXScene)scene;


@end
