//
//  NSObject+AudioFunc.m
//  PusmicMobileMahJong
//
//  Created by Prominic-No2 on 17/4/20.
//
//

#import "AudioFunc.h"
#import <AudioToolbox/AudioServices.h>
#import "ScriptingCore.h"
#import "lame.h"
BOOL isStopRecording;
BOOL isRecording;
NSString *filepathCaf;
NSString *filepathMp3;
AVAudioRecorder *audioRecorder;

NSTimer *timer;

// 采样率
typedef NS_ENUM(NSInteger, AudioSample) {
    AudioSampleRateLow = 8000,
    AudioSampleRateMedium = 44100, //音频CD采样率
    AudioSampleRateHigh = 96000
};

@interface AudioFunc()<AVAudioRecorderDelegate>
//@property (strong, nonatomic) IBOutlet UIProgressView *progressView;
//@property (nonatomic, strong) NSTimer *timer;
@end

@implementation  AudioFunc


+ (BOOL)startAudioRcored {
    if(!isRecording){
    NSLog(@"startAudioRcored start");
    //[super didReceiveMemoryWarning];
    
    timer = [NSTimer scheduledTimerWithTimeInterval:0.1
                                                  target:self
                                                selector:@selector(audioPowerChange)
                                                userInfo:nil
                                                 repeats:YES];
    timer.fireDate = [NSDate distantFuture];//暂停定时器
    
    // 获取沙盒Document文件路径
    NSString *sandBoxPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    // 拼接录音文件绝对路径
    NSString *fileName_caf =@"demoRecord.caf";
    NSString *fileName_mp3 =@"demoRecord.mp3";
    filepathCaf = [sandBoxPath stringByAppendingPathComponent:fileName_caf];
    filepathMp3 = [sandBoxPath stringByAppendingPathComponent:fileName_mp3];

     NSLog(@"startAudioRcored file:%@ ",filepathCaf);
     NSLog(@"startAudioRcored MP3 file:%@ ",filepathMp3);
    // 创建音频会话
    AVAudioSession *audioSession=[AVAudioSession sharedInstance];
    // 设置录音类别（这里选用录音后可回放录音类型）
    [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord withOptions:AVAudioSessionCategoryOptionDefaultToSpeaker  error:nil];
//    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord error: nil];
//    UInt32 audioRouteOverride = kAudioSessionOverrideAudioRoute_Speaker;
//    AudioSessionSetProperty (kAudioSessionProperty_OverrideAudioRoute,
//                             sizeof (audioRouteOverride),&audioRouteOverride);
    [audioSession setActive:YES error:nil];
       NSLog(@"startAudioRcored end ");
    audioRecorder=[self audioRecorder];
    isRecording=YES;
    }
    return YES;
    
}
+ (void)audioRecorderDidFinishRecording:(AVAudioRecorder *)aRecorder successfully:(BOOL)flag
{
    NSLog(@"audioRecorderDidFinishRecording");
   //  AVAudioSession *audioSession=[AVAudioSession sharedInstance];
    //[audioSession setActive:NO error:nil];
      NSLog(@"audioRecorderDidFinishRecording end");
    //isRecording=NO;
}

+(NSDictionary *)getAudioSetting{
    // LinearPCM 是iOS的一种无损编码格式,但是体积较为庞大
    // 录音设置信息字典
    NSMutableDictionary *recordSettings = [[NSMutableDictionary alloc] init];
    // 录音格式
    [recordSettings setValue :@(kAudioFormatLinearPCM) forKey: AVFormatIDKey];
    // 采样率
    [recordSettings setValue :@(11025.0) forKey: AVSampleRateKey];
    // 通道数(双通道)
    [recordSettings setValue :@2 forKey: AVNumberOfChannelsKey];
    // 每个采样点位数（有8、16、24、32）
    [recordSettings setValue :@16 forKey: AVLinearPCMBitDepthKey];
    // 采用浮点采样
    //[recordSettings setValue:@YES forKey:AVLinearPCMIsFloatKey];
    // 音频质量
    [recordSettings setValue:@(AVAudioQualityHigh) forKey:AVEncoderAudioQualityKey];
    // 其他可选的设置
    // ... ...
    
    return recordSettings;
}




// 懒加载录音机对象get方法
+ (AVAudioRecorder *)audioRecorder {
    
    if (!audioRecorder) {
        // 保存录音文件的路径url
        NSLog(@"url:%@",filepathCaf);
        NSLog(@"mp3 url:%@",filepathMp3);
        NSURL *url = [NSURL URLWithString:filepathCaf];
        // 创建录音格式设置setting
        NSDictionary *setting = [self getAudioSetting];
        // error
        NSError *error=nil;
        
        audioRecorder = [[AVAudioRecorder alloc]initWithURL:url settings:setting error:&error];
        audioRecorder.delegate = self;
        audioRecorder.meteringEnabled = YES;// 监控声波
        [audioRecorder recordForDuration:30];
        if (error) {
            NSLog(@"创建录音机对象时发生错误，错误信息：%@",error.localizedDescription);
            return nil;
        }
    }
    return audioRecorder;
}

-(void)startRecordByJS{
    if(filepathCaf.length<=0){
        [self startAudioRcored];
    }
    if (![audioRecorder isRecording]) {
        // 如果该路径下的音频文件录制过则删除
        [self deleteRecord];
        // 开始录音，会取得用户使用麦克风的同意
        [audioRecorder record];
    }
}
+(BOOL)deleteRecord{
    NSFileManager* fileManager=[NSFileManager defaultManager];
    //filepathMp3
    NSString *filepathMp3;
    NSString *fileName_mp3 =@"demoRecord.mp3";
    NSString *sandBoxPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    filepathMp3 = [sandBoxPath stringByAppendingPathComponent:fileName_mp3];
    if ([[NSFileManager defaultManager] fileExistsAtPath:filepathMp3]) {
        // 文件已经存在
        if ([fileManager removeItemAtPath:filepathMp3 error:nil]) {
            NSLog(@"删除成功MP3");
        }else {
            NSLog(@"删除失败");
        }
    }else {
        // return YES; // 文件不存在无需删除
    }
    if ([[NSFileManager defaultManager] fileExistsAtPath:filepathCaf]) {
        // 文件已经存在
        if ([fileManager removeItemAtPath:filepathCaf error:nil]) {
            NSLog(@"删除成功CAF");
        }else {
            NSLog(@"删除失败");
        }
    }else {
       // return YES; // 文件不存在无需删除
    }
    return YES;
}

// 开始录音或者继续录音
+ (IBAction)startOrResumeRecord {
    // 注意调用audiorecorder的get方法
    if (![audioRecorder isRecording]) {
        // 如果该路径下的音频文件录制过则删除
        [self deleteRecord];
        // 开始录音，会取得用户使用麦克风的同意
        [self startAudioRcored];
        audioRecorder=[self audioRecorder];
        //reback timer
        isStopRecording = NO;
        //[audioRecorder prepareToRecord];
        [audioRecorder record];
        timer.fireDate = [NSDate distantPast];
       // progressView.hidden =NO;
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            [self transcodingWhileRecording];
        });
    }
    
    
}

// 录音暂停
- (IBAction)pauseRecord {
    if (audioRecorder) {
        [audioRecorder pause];
    }
}

+ (void)audioPowerChange{
    //更新测量值
    [audioRecorder updateMeters];
    //取得第一个通道的音频，注意音频强度范围是-160.0到0
    float power = [audioRecorder averagePowerForChannel:0];
    CGFloat progress = (1.0/160.0)*(power+160.0);
    //NSLog(@"process:%f",progress);
    // self->progressView.progress=progress;
    //progressView.progress = progress;
    NSString *func =[NSString stringWithFormat:@"cc.find('AudioMessage').getComponent('AudioMessage').setProcessBar('%f');",progress];
    const char *stringFunc =[func UTF8String];
    //JS::MutableHandleValue *outval;
    
    ScriptingCore ::getInstance()->evalString(stringFunc);
}

// 结束录音
+ (void)stopRecord {
    [audioRecorder stop];
    isStopRecording = YES;
    timer.fireDate = [NSDate distantFuture];//暂停定时器
    //progressView.progress = 0.0;
    //progressView.hidden =YES;
    
    [self uploadingData];
   // [self setupAVPlayerForURL];
  
}

+ (void)stopRecordByJS {
    audioRecorder=[self audioRecorder];
    [audioRecorder stop];
    [self uploadingData];
}

+ (void)uploadingData {
    
   // NSArray *directoryPathsArray = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
   // NSString *documentsDirectory = [directoryPathsArray objectAtIndex:0];
    
  //  NSString *absoluteFilePath = [NSString stringWithFormat:@"%@/%@/%@", documentsDirectory, baseDirName, fileName];
    NSString *filepathMp3;
    NSString *fileName_mp3 =@"demoRecord.mp3";
    NSString *sandBoxPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    filepathMp3 = [sandBoxPath stringByAppendingPathComponent:fileName_mp3];
 
     NSLog(@"file name :%@",filepathMp3);
    NSFileManager* fileManager=[NSFileManager defaultManager];
    if ([[NSFileManager defaultManager] fileExistsAtPath:filepathMp3]) {
        NSData *zipFileData = [NSData dataWithContentsOfFile: filepathMp3];
        
        NSString *base64String = [zipFileData base64EncodedStringWithOptions:0];
        
        NSLog(@"++++:%@",base64String);
        NSString *func =[NSString stringWithFormat:@"cc.find('tableNerWorkScript').getComponent('GameTableNetWork').sendAudioMessage('%@');",base64String];
        const char *stringFunc =[func UTF8String];
               ScriptingCore ::getInstance()->evalString(stringFunc);
    }else{
        NSLog(@"No file exist!");
    }
    
   
    
    //base64String = [base64String stringByReplacingOccurrencesOfString:@"/"withString:@"_"];
    
   // base64String = [base64String stringByReplacingOccurrencesOfString:@"+" withString:@"-"];
    
    // Adding to JSON and upload goes here.
}

+(BOOL) startRecordByJSBool

{
    NSLog(@"----startRecordByJSBool----");
    if(filepathCaf.length<=0){
        [self startAudioRcored];
    }
    
    if (!audioRecorder.isRecording) {
        // 如果该路径下的音频文件录制过则删除
        [self deleteRecord];
        // 开始录音，会取得用户使用麦克风的同意
        [audioRecorder record];
    }
 NSLog(@"----startRecordByJSBool END----");
    return YES;
}

+(BOOL) stopRecordByJSBool
{
    [audioRecorder stop];
    [self uploadingData:filepathCaf];
      return YES;

}


// 边录边转码(要在子线中进行)
+ (void)transcodingWhileRecording {
    @try {
        int read, write;
        
        NSString *filepathMp3;
        NSString *fileName_mp3 =@"demoRecord.mp3";
         NSString *sandBoxPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
        filepathMp3 = [sandBoxPath stringByAppendingPathComponent:fileName_mp3];
        NSLog(@"filepathCaf:%@",filepathCaf);
        NSLog(@"mp3:%@",filepathMp3);
        FILE *pcm = fopen([filepathCaf cStringUsingEncoding:1], "rb");//source
        fseek(pcm, 4*1024, SEEK_CUR);                                           //skip file header
        FILE *mp3 = fopen([filepathMp3 cStringUsingEncoding:1], "wb");     //output
        
        const int PCM_SIZE = 8192;
        const int MP3_SIZE = 8192;
        short int pcm_buffer[PCM_SIZE*2];
        unsigned char mp3_buffer[MP3_SIZE];
        
        lame_t lame = lame_init();
        lame_set_in_samplerate(lame, 11025.0);
        lame_set_VBR(lame, vbr_default);
        lame_init_params(lame);
        
        long currentPosition;
        do {
            currentPosition = ftell(pcm);     //文件读到当前位置
            long startPosition = ftell(pcm);  //起始点
            fseek(pcm, 0, SEEK_END);          //将文件指针指向结束位置,为了获取结束点
            long endPosition = ftell(pcm);    //结束点
            long length = endPosition - startPosition; //获得文件长度
            fseek(pcm, currentPosition, SEEK_SET);//再将文件指针复位
            
            if (length > PCM_SIZE * 2 * sizeof(short int)) {
                read = (int)fread(pcm_buffer, 2*sizeof(short int), PCM_SIZE, pcm);
                if (read == 0) write = lame_encode_flush(lame, mp3_buffer, MP3_SIZE);
                else write = lame_encode_buffer_interleaved(lame, pcm_buffer, read, mp3_buffer, MP3_SIZE);
                fwrite(mp3_buffer, write, 1, mp3);
                NSLog(@"转码中...");
            }
            else {
                //让当前线程睡眠一小会,等待音频数据增加时,再继续转码
                [NSThread sleepForTimeInterval:0.02];
                NSLog(@"等待中...");
            }
            
        } while (!isStopRecording);
        
        lame_close(lame);
        fclose(mp3);
        fclose(pcm);
        
    }
    @catch (NSException *exception) {
        NSLog(@"%@",[exception description]);
    }
    @finally {
        //NSString *textValue = [NSString stringWithFormat:@"转换成功：%@", filepathMp3];
        NSLog(@"转换成功");
        
    }
    
}
// NSData *data = [[NSData alloc]initWithBase64EncodedString:strEncodeData options:NSDataBase64DecodingIgnoreUnknownCharacters];


+(void) setupAVPlayerForURL:(NSString *)filepathMp3 {
  //  NSString *filepathMp3;
    //NSString *fileName_mp3 =@"demoRecord.mp3";
 //   NSString *sandBoxPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
  //  filepathMp3 = [sandBoxPath stringByAppendingPathComponent:fileName_mp3];
    NSURL *url = [[NSURL alloc] initFileURLWithPath: filepathMp3];
    AVAsset *asset = [AVURLAsset URLAssetWithURL:url options:nil];
    AVPlayerItem *anItem = [AVPlayerItem playerItemWithAsset:asset];
    NSError *error=nil;

    AVAudioPlayer *player=[[AVAudioPlayer alloc]initWithContentsOfURL:url error:&error];
    player.numberOfLoops=0;
    [player prepareToPlay];
    //[player addObserver:self forKeyPath:@"status" options:0 context:nil];
    [player play];
    //[player removeObserver:self forKeyPath:@"status"];
    //self.player.currentItem removeObserver:self forKeyPath:kItemStatus];
}


+(BOOL)saveEncodeBase64toMp3:(NSString *)str title:(NSString *)tit{
    NSData *data = [[NSData alloc]initWithBase64EncodedString:str options:NSDataBase64DecodingIgnoreUnknownCharacters];
    //[data ]
    
    
    NSString *filepathMp3;
    NSString *fileName_mp3 =@"demoRecord_get.mp3";
    NSString *sandBoxPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject];
    filepathMp3 = [sandBoxPath stringByAppendingPathComponent:fileName_mp3];
    NSFileManager* fileManager=[NSFileManager defaultManager];
    if ([[NSFileManager defaultManager] fileExistsAtPath:filepathMp3]) {
        // 文件已经存在
        if ([fileManager removeItemAtPath:filepathMp3 error:nil]) {
            NSLog(@"删除成功CAF");
        }else {
            NSLog(@"删除失败");
        }
    }
    
    [data writeToFile:filepathMp3 atomically: NO];
    [self setupAVPlayerForURL:filepathMp3];

}

@end
