//
//  NSObject+LocationFunc.m
//  PusmicMobileMahJong
//
//  Created by Prominic-No2 on 17/4/21.
//
//

#import "LocationFunc.h"
#import "ScriptingCore.h"
CLLocationManager *locationManager;
//CLGeocoder *ceo;

@implementation  LocationFunc

+ (void)getCurrentLocation{
     NSLog(@"###########################getCurrentLocation######################");
   locationManager = [[CLLocationManager alloc]init];
   locationManager.delegate = self;
   locationManager.distanceFilter=kCLDistanceFilterNone;
   locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters;
   [locationManager requestWhenInUseAuthorization];
   [locationManager startUpdatingLocation];
      NSString *theLocation = [NSString stringWithFormat:@"latitude: %f longitude: %f", locationManager.location.coordinate.latitude, locationManager.location.coordinate.longitude];
    NSLog(@"%@",theLocation);
    //progressView.progress = progress;
    NSString *func =[NSString stringWithFormat:@"cc.find('tableNerWorkScript').getComponent('GameTableNetWork').saveLocationInfoToGobalInfo('%f','%f');",locationManager.location.coordinate.longitude,locationManager.location.coordinate.latitude];
    const char *stringFunc =[func UTF8String];
    //JS::MutableHandleValue *outval;
    
    ScriptingCore ::getInstance()->evalString(stringFunc);
}

+ (void)initalLocation{
    locationManager = [[CLLocationManager alloc]init];
    locationManager.delegate = self;
    locationManager.distanceFilter=kCLDistanceFilterNone;
    locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters;
    [locationManager requestWhenInUseAuthorization];
    [locationManager startUpdatingLocation];
}

@end
