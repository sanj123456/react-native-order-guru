//
//  CitizenPrinterModule.m
//  myOrderingApp
//
//  Created by Kushdeep Singh on 16/02/23.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"


@interface
RCT_EXTERN_MODULE(CitizenPrinterModule, NSObject)
RCT_EXTERN_METHOD(handleBluetoothPrintCommand:(NSString *)numOfCopy printData:(NSString *)printData
                  callback: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getBluetoothPrinters:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(connectToBluetoothPrinter:(NSString *)withAddress callback: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(disconnectFromBluetoothPrinter:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(checkBluetoothPrinterStatus:(RCTResponseSenderBlock)callback)
@end
