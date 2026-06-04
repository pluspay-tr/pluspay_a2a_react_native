#import "PluspayA2aReactNative.h"

// PlusPay POS+ App2App (A2A) is Android-only (Android intents). On iOS every
// method rejects with UNSUPPORTED_PLATFORM so the package still builds.
@implementation PluspayA2aReactNative

- (void)initialize:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject
{
  reject(@"UNSUPPORTED_PLATFORM", @"PlusPay A2A is only supported on Android.", nil);
}

- (void)sendRequest:(NSString *)requestJson
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject
{
  reject(@"UNSUPPORTED_PLATFORM", @"PlusPay A2A is only supported on Android.", nil);
}

- (void)dispose:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject
{
  resolve(nil);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativePluspayA2aReactNativeSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"PluspayA2aReactNative";
}

@end
