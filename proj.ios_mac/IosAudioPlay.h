//
//  NSObject+IosAudioPlay.h
//  PusmicMobileMahJong
//
//  Created by Prominic-No2 on 17/4/20.
//
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@interface IosAudioPlay : UIViewController <AVAudioPlayerDelegate>
{
    NSURL *recordedFile;
    AVAudioPlayer *player;
    AVAudioRecorder *recorder;
    NSString *filepathCaf;
    
}
//-(void)playAudio;
//-(void)AudioRecording;
@end
