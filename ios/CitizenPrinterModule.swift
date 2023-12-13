//
//  CitizenPrinterModule.swift
//  myOrderingApp
//
//  Created by Kushdeep Singh on 16/02/23.
//

import Foundation
import CSJPOSLibSwift

public struct PrintDataItemTypes: Encodable,Decodable {
    var productName: String
    var qty: Int
    var price: String
    var instruction: String
    var modifier: Array<ModifierItemTypes>
}

public struct ModifierItemTypes: Encodable,Decodable {
    var name: String
    var price: String
    var selectedSubModifier: SelectedSubModifierItemTypes
}

public struct SelectedSubModifierItemTypes: Encodable,Decodable {
    var name: String
    var price: String
}

public struct PrintDataTotalTypes: Encodable,Decodable {
    var label: String
    var value: String
}

public struct PrintDataCustomerTypes: Encodable,Decodable {
    var name: String
    var phone: String
    var note: String
    var time: String  
}

public struct PrintDataPaymentTypes: Encodable,Decodable {
    var method: String
    var status: String
    var deliveryAddress:String
    var orderId: String
}

public struct PrintDataTypes: Encodable,Decodable {
    var itemsDetails: Array<PrintDataItemTypes>
    var totalDetails: Array<PrintDataTotalTypes>
    var customer: PrintDataCustomerTypes
    var payment: PrintDataPaymentTypes
}

@objc(CitizenPrinterModule)
class CitizenPrinterModule: NSObject {
  
  // Create an instance.
  var printer: ESCPOSPrinter? = CSJPOSLibSwift.ESCPOSPrinter()
  var result: Int32 = 1
  
  
//  Handle bluetooth function
  @objc
  func handleBluetoothPrintCommand(_ numOfCopy:String, printData:String,callback: RCTResponseSenderBlock){
    // Handling li8ne separator
    var delimator = ""
    let maxCharactersInLine = 48
    for i in 0..<maxCharactersInLine {
        delimator += "-"
    }
    delimator += "\n"
    print("Printer Number of copies string", numOfCopy)
    let numberOfCopies = (numOfCopy as NSString).integerValue
    print("Printer Number of copies", numberOfCopies)
    
    //    Parsing Json data
      let jsonData = printData.data(using: .utf8)!
      let newPrintData: PrintDataTypes = try! JSONDecoder().decode(PrintDataTypes.self, from: jsonData)

   for i in 0..<numberOfCopies {
      if CMP_SUCCESS == printer!.printerCheck() {
        // Success
        
        //  Check Printer Status
        let status = printer!.status()
        if CMP_STS_NORMAL == status {
          
          
          // No Error
          // Set encoding
          _ = printer!.setEncoding(String.Encoding.shiftJIS)
          
          // Start Transaction ( Batch )
          _ = printer!.transactionPrint(CMP_TP_TRANSACTION)
          
          _ = printer!.printText("\(newPrintData.payment.status)\n",
                                 withAlignment:CMP_ALIGNMENT_CENTER,
                                 withAttribute:CMP_FNT_DEFAULT,
                                 withTextSize:CMP_TXT_2WIDTH|CMP_TXT_2HEIGHT)
          _ = printer!.printText("#\(newPrintData.payment.orderId)\n",
                                 withAlignment:CMP_ALIGNMENT_CENTER,
                                 withAttribute:CMP_FNT_DEFAULT,
                                 withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
          
          // Line separator
          _ = printer!.printText(delimator, withAlignment:CMP_ALIGNMENT_CENTER, withAttribute:CMP_FNT_DEFAULT, withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
          
          // Customer Data View
          _ = printer!.printText("\(newPrintData.customer.name)\n",
                                 withAlignment:CMP_ALIGNMENT_CENTER,
                                 withAttribute:CMP_FNT_DEFAULT,
                                 withTextSize:CMP_TXT_2WIDTH|CMP_TXT_1HEIGHT)
          _ = printer!.printText("Phone: \(newPrintData.customer.phone)\n",
                                 withAlignment:CMP_ALIGNMENT_CENTER,
                                 withAttribute:CMP_FNT_DEFAULT,
                                 withTextSize:CMP_TXT_1WIDTH|CMP_TXT_2HEIGHT)
          
          // Line separator
          _ = printer!.printText(delimator, withAlignment:CMP_ALIGNMENT_CENTER, withAttribute:CMP_FNT_DEFAULT, withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
          
          // Customer Data View
          _ = printer!.printText("\(newPrintData.payment.method)\n",
                                 withAlignment:CMP_ALIGNMENT_CENTER,
                                 withAttribute:CMP_FNT_DEFAULT,
                                 withTextSize:CMP_TXT_2WIDTH|CMP_TXT_1HEIGHT)

          _ = printer!.printText("Time: \(newPrintData.customer.time)\n",
                                 withAlignment:CMP_ALIGNMENT_CENTER,
                                 withAttribute:CMP_FNT_DEFAULT,
                                 withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)

          if newPrintData.customer.note != "" {
            _ = printer!.printText("Note: \(newPrintData.customer.note)\n",
                                 withAlignment:CMP_ALIGNMENT_LEFT,
                                 withAttribute:CMP_FNT_DEFAULT,
                                 withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
          }

          if newPrintData.payment.method=="Delivery" {
            
            _ = printer!.printText("\(newPrintData.payment.deliveryAddress)\n",
                                   withAlignment:CMP_ALIGNMENT_CENTER,
                                   withAttribute:CMP_FNT_DEFAULT,
                                   withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
          }
          
          // Line separator
          _ = printer!.printText(delimator, withAlignment:CMP_ALIGNMENT_CENTER, withAttribute:CMP_FNT_DEFAULT, withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
          
          // Order Items view handling
          for printItem in newPrintData.itemsDetails {
            let itemWithQtyStr = String(describing: printItem.qty)+"x "+String(describing: printItem.productName)
            let itemPriceStr = "$"+String(describing: printItem.price)+"\n"
            let instructionStr = "Instructions: "+String(describing: printItem.instruction)+"\n"
            _ = printer!.printPaddingText(itemWithQtyStr,
                                          withAttribute:CMP_FNT_BOLD,
                                          withTextSize:CMP_TXT_1WIDTH|CMP_TXT_3HEIGHT,
                                          withLength:35,withSide:CMP_SIDE_RIGHT);
            _ = printer!.printPaddingText(itemPriceStr,
                                          withAttribute:CMP_FNT_BOLD,
                                          withTextSize:CMP_TXT_1WIDTH|CMP_TXT_3HEIGHT,
                                          withLength:10,withSide: CMP_SIDE_LEFT);
            _ = printer!.printNormal("\n");
            for modifierItem in printItem.modifier {
              let modifierNameStr = "  -"+String(describing: modifierItem.name)
              let modifierPriceStr = "$"+String(describing: modifierItem.price)+"\n"
              let subModifierNameStr = "   "+String(describing: modifierItem.selectedSubModifier.name)
              let subModifierPriceStr = "$"+String(describing: modifierItem.selectedSubModifier.price)+"\n"
              
              if modifierItem.price != "-" {
                _ = printer!.printPaddingText(modifierNameStr,
                                    withAttribute:CMP_FNT_DEFAULT,
                                    withTextSize:CMP_TXT_1WIDTH|CMP_TXT_2HEIGHT,
                                    withLength:34,withSide:CMP_SIDE_RIGHT)
                _ = printer!.printPaddingText(modifierPriceStr,
                                    withAttribute:CMP_FNT_DEFAULT,
                                    withTextSize:CMP_TXT_1WIDTH|CMP_TXT_2HEIGHT,
                                    withLength:10,withSide: CMP_SIDE_LEFT);
              } else {
                _ = printer!.printText(modifierNameStr+"\n",
                                     withAlignment:CMP_ALIGNMENT_LEFT,
                                     withAttribute:CMP_FNT_DEFAULT,
                                     withTextSize:CMP_TXT_1WIDTH|CMP_TXT_2HEIGHT)
              }

              if modifierItem.selectedSubModifier.name != "" {
                if modifierItem.selectedSubModifier.price != "0.00" {  
                  _ = printer!.printPaddingText(subModifierNameStr,
                                            withAttribute:CMP_FNT_DEFAULT,
                                            withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT,
                                            withLength:34,withSide:CMP_SIDE_RIGHT);                          
                  _ = printer!.printPaddingText(subModifierPriceStr,
                                            withAttribute:CMP_FNT_DEFAULT,
                                            withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT,
                                            withLength:10,withSide: CMP_SIDE_LEFT);
                } else {
                  _ = printer!.printText(subModifierNameStr+"\n",
                                     withAlignment:CMP_ALIGNMENT_LEFT,
                                     withAttribute:CMP_FNT_DEFAULT,
                                     withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
                }
              }
            }

            if printItem.instruction != "" {
              _ = printer!.printText(instructionStr+"\n",
                                    withAlignment:CMP_ALIGNMENT_LEFT,
                                    withAttribute:CMP_FNT_DEFAULT,
                                    withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
            }
            
            _ = printer!.printNormal("\n");
          }
          
          // Line separator
          _ = printer!.printText(delimator, withAlignment:CMP_ALIGNMENT_CENTER, withAttribute:CMP_FNT_DEFAULT, withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
          
          // Order Items view handling
          for totalItem in newPrintData.totalDetails {
            let itemWithQtyStr = String(describing: totalItem.label)
            let itemPriceStr = "$"+String(describing: totalItem.value)+"\n"
            _ = printer!.printPaddingText(itemWithQtyStr,
                                          withAttribute:CMP_FNT_DEFAULT,
                                          withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT,
                                          withLength:35,withSide:CMP_SIDE_RIGHT);
            _ = printer!.printPaddingText(itemPriceStr,
                                          withAttribute:CMP_FNT_DEFAULT,
                                          withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT,
                                          withLength:10,withSide: CMP_SIDE_LEFT);
          }
          
          // Line separator
          _ = printer!.printText(delimator, withAlignment:CMP_ALIGNMENT_CENTER, withAttribute:CMP_FNT_DEFAULT, withTextSize:CMP_TXT_1WIDTH|CMP_TXT_1HEIGHT)
          
          // Partial Cut with Pre-Feed
          _ = printer!.cutPaper(CMP_CUT_PARTIAL_PREFEED)
          
          // End Transaction ( Batch )
          result = printer!.transactionPrint(CMP_TP_NORMAL)
          
          // Disconnect
          // _ = printer!.disconnect()
          callback(["success"])
        } else {
          if (CMP_STS_COVER_OPEN & status) > 0 {
            // Cover Open
            callback(["Printer cover is open"])
          }
          if (CMP_STS_PAPER_EMPTY & status) > 0 {
            // Paper Empty
            callback(["There is no paper in printer"])
          }
          if (CMP_STS_PRINTEROFF & status) > 0 {
            // Printer Offline
            callback(["Printer is offline"])
          } }
      } else {
        // Fail
        callback(["Error occurred. Please check the printer and device bluetooth settings"])
      }
   }
  }
  
  //  Handle bluetooth printer list function
    @objc
    func getBluetoothPrinters(_ callback: RCTResponseSenderBlock){
      if let data =  printer?.searchESCPOSPrinter(CMP_PORT_BLUETOOTH, withSearchTime: 5,result: &result ) {
        print("Printer error", data)
        callback([data])
      } else{
        callback(["Error"])
      }
    }
  
//  handle connect to a bluetooth printer
  @objc
  func connectToBluetoothPrinter(_ withAddress:String, callback: RCTResponseSenderBlock){
    result = printer!.connect(CMP_PORT_BLUETOOTH, withAddrress: withAddress)
    if CMP_SUCCESS == result {
      if CMP_SUCCESS != result {
        print("handleBluetoothPrintCommand DisplayText Error : \(result)")
        callback(["Unable to connect with printer. Please check the printer and device bluetooth settings and try again."])
      }
      callback(["success"])
    } else{
      print("handleBluetoothPrintCommand Connect Error : \(result)")
      callback(["Unable to connect with printer. Please check the printer and device bluetooth settings and try again."])
    }
  }
  
  //  handle disconnect from a bluetooth printer
  @objc
  func disconnectFromBluetoothPrinter(_ callback: RCTResponseSenderBlock){
    if CMP_SUCCESS == printer!.disconnect() {
    // Success
      callback(["success"])
    } else {
    // Fail
      callback(["Error occurred. Please try again sometime"])
    }
  }
  
  //  handle check bluetooth printer status
  @objc
  func checkBluetoothPrinterStatus(_ callback: RCTResponseSenderBlock){
    if CMP_SUCCESS == printer!.printerCheck() {
    // Success
      var status = printer!.status()
      if CMP_STS_NORMAL == status {
      // No Error
        callback(["success"])
      } else {
        if (CMP_STS_COVER_OPEN & status) > 0 {
        // Cover Open
          callback(["Printer cover is open"])
        }
        if (CMP_STS_PAPER_EMPTY & status) > 0 {
              // Paper Empty
          callback(["There is no paper in printer"])
        }
        if (CMP_STS_PRINTEROFF & status) > 0 {
              // Printer Offline
          callback(["Printer is offline"])
        } }
    } else {
    // Fail
      callback(["Error occurred. Please check the printer and device bluetooth settings"])
    }
  }
  
  @objc
   static func requiresMainQueueSetup() -> Bool {
     return true
   }
  
}
