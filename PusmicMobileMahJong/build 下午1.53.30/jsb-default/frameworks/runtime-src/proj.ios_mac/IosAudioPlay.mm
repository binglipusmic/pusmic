//
//  NSObject+IosAudioPlay.m
//  PusmicMobileMahJong
//
//  Created by Prominic-No2 on 17/4/20.
//
//
#import "IosAudioPlay.h"

@implementation IosAudioPlay
extern BOOL isRecording;

-(void)playAudio
{
    
    if([player isPlaying])
    {
        NSLog(@"停止录音播放");
        [player pause];
    }
    else
    {
        NSLog(@"开始录音播放");
        [player play];
    }
}

+(NSDictionary *)getAudioSetting{
    // LinearPCM 是iOS的一种无损编码格式,但是体积较为庞大
    // 录音设置信息字典
    NSMutableDictionary *recordSettings = [[NSMutableDictionary alloc] init];
    // 录音格式
    [recordSettings setValue :@(kAudioFormatMPEGLayer3) forKey: AVFormatIDKey];
    // 采样率
    [recordSettings setValue :@11025.0 forKey: AVSampleRateKey];
    // 通道数(双通道)
    [recordSettings setValue :@2 forKey: AVNumberOfChannelsKey];
    // 每个采样点位数（有8、16、24、32）
    [recordSettings setValue :@16 forKey: AVLinearPCMBitDepthKey];
    // 采用浮点采样
    [recordSettings setValue:@YES forKey:AVLinearPCMIsFloatKey];
    // 音频质量
    [recordSettings setValue:@(AVAudioQualityMedium) forKey:AVEncoderAudioQualityKey];
    // 其他可选的设置
    // ... ...
    
    return recordSettings;
}

+(void)AudioRecording


{
    NSLog(@"starting loginc");
    NSString *fileName_caf =@"demoRecord.mp3";
    // 获取沙盒Document文件路径
    NSString *sandBoxPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
   NSString *filepathCaf = [sandBoxPath stringByAppendingPathComponent:fileName_caf];
    
     NSURL *recordedFile= [NSURL URLWithString:filepathCaf];
    NSDictionary *setting = [self getAudioSetting];
    
    //recordedFile = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingString:@"RecordedFile"]];
    AVAudioSession *session = [AVAudioSession sharedInstance];
    NSError *sessionError;
    [session setCategory:AVAudioSessionCategoryPlayAndRecord error:&sessionError];
    
    if(session == nil)
        NSLog(@"创建session: %@失败!", [sessionError description]);
    else
        [session setActive:YES error:nil];
   // if(!isRecording)
   // {
//        isRecording = YES;
        NSLog(@"正在录音");
        AVAudioRecorder *recorder = [[AVAudioRecorder alloc] initWithURL:recordedFile settings:setting error:nil];
        [recorder prepareToRecord];
        [recorder record];
      //  player = nil;
  //  }
 //   else
  //  {
//        isRecording = NO;
//        NSLog(@"停止录音");
//        NSError *playerError;
//        player = [[AVAudioPlayer alloc] initWithContentsOfURL:recordedFile error:&playerError];
//        if (player == nil)
//        {
//            NSLog(@"创建player: %@失败!", [playerError description]);
//        }
//        player.delegate = self;
//        [recorder stop];
//        recorder = nil;
        
        
        
  //  }
}


@end
