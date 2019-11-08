import React from 'react';
import socketIOClient from 'socket.io-client'
import DeckGL, {
  MapController,
  GeoJsonLayer,
  HexagonLayer,
  AmbientLight,
  PointLight,
  LightingEffect,
  FlyToInterpolator,
  LinearInterpolator,
  TripsLayer,
  ScatterplotLayer,
} from 'deck.gl';
import {DataFilterExtension} from '@deck.gl/extensions';
import {StaticMap} from 'react-map-gl';
import {PhongMaterial} from '@luma.gl/core';

import geojsonLength from 'geojson-length'
import COMMUNES_JSON from '../data/adbijan/communes.json';
import DOTS_JSON from '../data/adbijan/dots.json';
// import PATH_JSON from '../data/adbijan/path.json';
// import TRIPS_JSON from '../data/adbijan/Trip_1.json';
// import NYC_JSON from '../data/adbijan/nyc-trips.json';
import INCIDENTS_JSON from '../data/adbijan/incidents.json';
// import TRIP_CSV from '../data/adbijan/trips-csv'
// import axios from "axios";

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0;
  } else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344
    }
    if (unit === "N") {
      dist = dist * 0.8684
    }
    return dist;
  }
}

const trip = [
  {
    "coordinates": [
      5.2563,
      -3.92892
    ],
    "timestamp": 0
  },
  {
    "coordinates": [
      5.25673,
      -3.92875
    ],
    "timestamp": 8.793186316651543
  },
  {
    "coordinates": [
      5.25724,
      -3.92854
    ],
    "timestamp": 19.281440035460694
  },
  {
    "coordinates": [
      5.25937,
      -3.92766
    ],
    "timestamp": 63.10650599855386
  },
  {
    "coordinates": [
      5.25986,
      -3.92746
    ],
    "timestamp": 73.17081691444922
  },
  {
    "coordinates": [
      5.26035,
      -3.92726
    ],
    "timestamp": 83.23512783034458
  },
  {
    "coordinates": [
      5.26108,
      -3.92697
    ],
    "timestamp": 98.17276453419424
  },
  {
    "coordinates": [
      5.26165,
      -3.92672
    ],
    "timestamp": 110.00789722475048
  },
  {
    "coordinates": [
      5.2619,
      -3.92661
    ],
    "timestamp": 115.20140386536761
  },
  {
    "coordinates": [
      5.26234,
      -3.92643
    ],
    "timestamp": 124.24165637031528
  },
  {
    "coordinates": [
      5.26344,
      -3.92597
    ],
    "timestamp": 146.91444018019587
  },
  {
    "coordinates": [
      5.26344,
      -3.92597
    ],
    "timestamp": 146.91444018019587
  },
  {
    "coordinates": [
      5.26371,
      -3.92683
    ],
    "timestamp": 166.41676873535732
  },
  {
    "coordinates": [
      5.26377,
      -3.927
    ],
    "timestamp": 170.31752711778657
  },
  {
    "coordinates": [
      5.26385,
      -3.92726
    ],
    "timestamp": 176.20300879908982
  },
  {
    "coordinates": [
      5.26409,
      -3.92794
    ],
    "timestamp": 191.8062627041956
  },
  {
    "coordinates": [
      5.26412,
      -3.92803
    ],
    "timestamp": 193.85879972828525
  },
  {
    "coordinates": [
      5.26412,
      -3.92809
    ],
    "timestamp": 195.15630224904066
  },
  {
    "coordinates": [
      5.26412,
      -3.92812
    ],
    "timestamp": 195.80505350941834
  },
  {
    "coordinates": [
      5.26411,
      -3.92822
    ],
    "timestamp": 197.9787388450528
  },
  {
    "coordinates": [
      5.26403,
      -3.92856
    ],
    "timestamp": 205.53463570577105
  },
  {
    "coordinates": [
      5.26399,
      -3.92875
    ],
    "timestamp": 209.73472850974585
  },
  {
    "coordinates": [
      5.26396,
      -3.92894
    ],
    "timestamp": 213.89533892345602
  },
  {
    "coordinates": [
      5.26396,
      -3.92894
    ],
    "timestamp": 213.89533892345602
  },
  {
    "coordinates": [
      5.26396,
      -3.92898
    ],
    "timestamp": 214.72284248842652
  },
  {
    "coordinates": [
      5.26396,
      -3.92915
    ],
    "timestamp": 218.2385646969748
  },
  {
    "coordinates": [
      5.26396,
      -3.92977
    ],
    "timestamp": 231.06053671062523
  },
  {
    "coordinates": [
      5.26396,
      -3.93002
    ],
    "timestamp": 236.230697386414
  },
  {
    "coordinates": [
      5.26396,
      -3.93044
    ],
    "timestamp": 244.9165624279612
  },
  {
    "coordinates": [
      5.26398,
      -3.93075
    ],
    "timestamp": 251.34097766322682
  },
  {
    "coordinates": [
      5.26397,
      -3.93089
    ],
    "timestamp": 254.24371896764438
  },
  {
    "coordinates": [
      5.26394,
      -3.93101
    ],
    "timestamp": 256.8025018737881
  },
  {
    "coordinates": [
      5.26392,
      -3.93108
    ],
    "timestamp": 258.30851585855225
  },
  {
    "coordinates": [
      5.2639,
      -3.93115
    ],
    "timestamp": 259.8145298433164
  },
  {
    "coordinates": [
      5.26382,
      -3.93134
    ],
    "timestamp": 264.08067087399195
  },
  {
    "coordinates": [
      5.2638,
      -3.93138
    ],
    "timestamp": 265.00644249046184
  },
  {
    "coordinates": [
      5.26378,
      -3.93141
    ],
    "timestamp": 265.7530550709074
  },
  {
    "coordinates": [
      5.26363,
      -3.93164
    ],
    "timestamp": 271.4389211992266
  },
  {
    "coordinates": [
      5.2636,
      -3.93167
    ],
    "timestamp": 272.31836580469843
  },
  {
    "coordinates": [
      5.26351,
      -3.93198
    ],
    "timestamp": 278.9962481953192
  },
  {
    "coordinates": [
      5.26351,
      -3.93198
    ],
    "timestamp": 278.9962481953192
  },
  {
    "coordinates": [
      5.26325,
      -3.93208
    ],
    "timestamp": 284.5540887290492
  },
  {
    "coordinates": [
      5.26252,
      -3.93237
    ],
    "timestamp": 300.22528933033414
  },
  {
    "coordinates": [
      5.26218,
      -3.9325
    ],
    "timestamp": 307.4877407778962
  },
  {
    "coordinates": [
      5.2613,
      -3.93285
    ],
    "timestamp": 326.3820690413054
  },
  {
    "coordinates": [
      5.2608,
      -3.93305
    ],
    "timestamp": 337.1258148217976
  },
  {
    "coordinates": [
      5.26024,
      -3.93325
    ],
    "timestamp": 348.99056415996574
  },
  {
    "coordinates": [
      5.25991,
      -3.93338
    ],
    "timestamp": 356.0668258242911
  },
  {
    "coordinates": [
      5.25886,
      -3.93384
    ],
    "timestamp": 378.9348758960884
  },
  {
    "coordinates": [
      5.25886,
      -3.93384
    ],
    "timestamp": 378.9348758960884
  },
  {
    "coordinates": [
      5.25896,
      -3.93407
    ],
    "timestamp": 388.858974141178
  },
  {
    "coordinates": [
      5.25896,
      -3.93407
    ],
    "timestamp": 388.858974141178
  },
  {
    "coordinates": [
      5.25837,
      -3.93432
    ],
    "timestamp": 403.44262714908143
  },
  {
    "coordinates": [
      5.25804,
      -3.93444
    ],
    "timestamp": 411.4354783880724
  },
  {
    "coordinates": [
      5.25788,
      -3.93451
    ],
    "timestamp": 415.41007494508716
  },
  {
    "coordinates": [
      5.25776,
      -3.93456
    ],
    "timestamp": 418.3688327903025
  },
  {
    "coordinates": [
      5.25772,
      -3.93458
    ],
    "timestamp": 419.386424753127
  },
  {
    "coordinates": [
      5.25772,
      -3.93459
    ],
    "timestamp": 419.6123394767524
  },
  {
    "coordinates": [
      5.25771,
      -3.9346
    ],
    "timestamp": 419.9336011933193
  },
  {
    "coordinates": [
      5.25771,
      -3.93461
    ],
    "timestamp": 420.160351094372
  },
  {
    "coordinates": [
      5.2577,
      -3.93463
    ],
    "timestamp": 420.66775196490113
  },
  {
    "coordinates": [
      5.2577,
      -3.93467
    ],
    "timestamp": 421.5749599550088
  },
  {
    "coordinates": [
      5.25766,
      -3.93504
    ],
    "timestamp": 430.0151139626691
  },
  {
    "coordinates": [
      5.25764,
      -3.93516
    ],
    "timestamp": 432.7742622200756
  },
  {
    "coordinates": [
      5.25763,
      -3.93518
    ],
    "timestamp": 433.28166309060475
  },
  {
    "coordinates": [
      5.25762,
      -3.93521
    ],
    "timestamp": 433.9989728086142
  },
  {
    "coordinates": [
      5.2576,
      -3.93522
    ],
    "timestamp": 434.5074900740475
  },
  {
    "coordinates": [
      5.25759,
      -3.93523
    ],
    "timestamp": 434.828162859383
  },
  {
    "coordinates": [
      5.25755,
      -3.93525
    ],
    "timestamp": 435.84556904548975
  },
  {
    "coordinates": [
      5.25738,
      -3.93532
    ],
    "timestamp": 440.0299296930118
  },
  {
    "coordinates": [
      5.25738,
      -3.93532
    ],
    "timestamp": 440.0299296930118
  },
  {
    "coordinates": [
      5.25755,
      -3.93574
    ],
    "timestamp": 443.00971872081135
  },
  {
    "coordinates": [
      5.25784,
      -3.9364
    ],
    "timestamp": 447.75111025476207
  },
  {
    "coordinates": [
      5.25819,
      -3.93728
    ],
    "timestamp": 453.9792009662892
  },
  {
    "coordinates": [
      5.25828,
      -3.93749
    ],
    "timestamp": 455.4818345012485
  },
  {
    "coordinates": [
      5.25956,
      -3.9406
    ],
    "timestamp": 477.5994645370404
  },
  {
    "coordinates": [
      5.2599,
      -3.94141
    ],
    "timestamp": 483.3768395345578
  },
  {
    "coordinates": [
      5.26079,
      -3.94359
    ],
    "timestamp": 498.8623087958713
  },
  {
    "coordinates": [
      5.26118,
      -3.94452
    ],
    "timestamp": 505.4946306557622
  },
  {
    "coordinates": [
      5.26151,
      -3.94529
    ],
    "timestamp": 511.0042558916152
  },
  {
    "coordinates": [
      5.26155,
      -3.9454
    ],
    "timestamp": 511.7739449751728
  },
  {
    "coordinates": [
      5.26193,
      -3.9463
    ],
    "timestamp": 518.1989488462702
  },
  {
    "coordinates": [
      5.26245,
      -3.94754
    ],
    "timestamp": 527.0420300962896
  },
  {
    "coordinates": [
      5.26275,
      -3.94825
    ],
    "timestamp": 532.1112105825554
  },
  {
    "coordinates": [
      5.26335,
      -3.94967
    ],
    "timestamp": 542.2495590266544
  },
  {
    "coordinates": [
      5.26361,
      -3.95032
    ],
    "timestamp": 546.853444785618
  },
  {
    "coordinates": [
      5.26376,
      -3.95069
    ],
    "timestamp": 549.4790714341071
  },
  {
    "coordinates": [
      5.26393,
      -3.95109
    ],
    "timestamp": 552.3374964075482
  },
  {
    "coordinates": [
      5.26413,
      -3.95158
    ],
    "timestamp": 555.8180399433247
  },
  {
    "coordinates": [
      5.26436,
      -3.95213
    ],
    "timestamp": 559.7387126845633
  },
  {
    "coordinates": [
      5.26484,
      -3.95331
    ],
    "timestamp": 568.1163499631402
  },
  {
    "coordinates": [
      5.2651,
      -3.95391
    ],
    "timestamp": 572.4170311524583
  },
  {
    "coordinates": [
      5.26544,
      -3.95473
    ],
    "timestamp": 578.2549836324224
  },
  {
    "coordinates": [
      5.26555,
      -3.95499
    ],
    "timestamp": 580.1116547304157
  },
  {
    "coordinates": [
      5.26572,
      -3.95541
    ],
    "timestamp": 583.0914117876592
  },
  {
    "coordinates": [
      5.266,
      -3.95608
    ],
    "timestamp": 587.8670307497592
  },
  {
    "coordinates": [
      5.26618,
      -3.95652
    ],
    "timestamp": 590.9934362534144
  },
  {
    "coordinates": [
      5.2664,
      -3.95704
    ],
    "timestamp": 594.7067827252075
  },
  {
    "coordinates": [
      5.26659,
      -3.95751
    ],
    "timestamp": 598.0406773614252
  },
  {
    "coordinates": [
      5.26689,
      -3.95824
    ],
    "timestamp": 603.2310857170946
  },
  {
    "coordinates": [
      5.26703,
      -3.95857
    ],
    "timestamp": 605.5886230837524
  },
  {
    "coordinates": [
      5.26713,
      -3.95884
    ],
    "timestamp": 607.4819521524473
  },
  {
    "coordinates": [
      5.26722,
      -3.95908
    ],
    "timestamp": 609.1674766570599
  },
  {
    "coordinates": [
      5.26725,
      -3.95919
    ],
    "timestamp": 609.9170797053943
  },
  {
    "coordinates": [
      5.26728,
      -3.95933
    ],
    "timestamp": 610.8582691060977
  },
  {
    "coordinates": [
      5.26733,
      -3.95953
    ],
    "timestamp": 612.2135567071559
  },
  {
    "coordinates": [
      5.26734,
      -3.95956
    ],
    "timestamp": 612.4215237968369
  },
  {
    "coordinates": [
      5.26737,
      -3.95969
    ],
    "timestamp": 613.2985831602463
  },
  {
    "coordinates": [
      5.26743,
      -3.95986
    ],
    "timestamp": 614.4839904816702
  },
  {
    "coordinates": [
      5.26747,
      -3.95997
    ],
    "timestamp": 615.2536589364918
  },
  {
    "coordinates": [
      5.26753,
      -3.96011
    ],
    "timestamp": 616.2553864488715
  },
  {
    "coordinates": [
      5.26772,
      -3.96051
    ],
    "timestamp": 619.1681360856622
  },
  {
    "coordinates": [
      5.26777,
      -3.96062
    ],
    "timestamp": 619.9628531426713
  },
  {
    "coordinates": [
      5.26779,
      -3.96069
    ],
    "timestamp": 620.4414767652265
  },
  {
    "coordinates": [
      5.26789,
      -3.96091
    ],
    "timestamp": 622.0309308579289
  },
  {
    "coordinates": [
      5.26789,
      -3.96091
    ],
    "timestamp": 622.0309308579289
  },
  {
    "coordinates": [
      5.26794,
      -3.961
    ],
    "timestamp": 622.8807936674592
  },
  {
    "coordinates": [
      5.268,
      -3.9611
    ],
    "timestamp": 623.8435652135307
  },
  {
    "coordinates": [
      5.26808,
      -3.96124
    ],
    "timestamp": 625.1746449400895
  },
  {
    "coordinates": [
      5.26818,
      -3.96139
    ],
    "timestamp": 626.6632151737798
  },
  {
    "coordinates": [
      5.26833,
      -3.96153
    ],
    "timestamp": 628.3590835636121
  },
  {
    "coordinates": [
      5.2685,
      -3.96167
    ],
    "timestamp": 630.1797534009647
  },
  {
    "coordinates": [
      5.26857,
      -3.96172
    ],
    "timestamp": 630.8911300029496
  },
  {
    "coordinates": [
      5.26864,
      -3.96177
    ],
    "timestamp": 631.6025417407161
  },
  {
    "coordinates": [
      5.26874,
      -3.96184
    ],
    "timestamp": 632.6120030165443
  },
  {
    "coordinates": [
      5.27001,
      -3.96253
    ],
    "timestamp": 644.5698677421731
  },
  {
    "coordinates": [
      5.27086,
      -3.96299
    ],
    "timestamp": 652.5660642092781
  },
  {
    "coordinates": [
      5.27317,
      -3.96427
    ],
    "timestamp": 674.4148676198272
  },
  {
    "coordinates": [
      5.27385,
      -3.96464
    ],
    "timestamp": 680.8196536894592
  },
  {
    "coordinates": [
      5.27424,
      -3.96485
    ],
    "timestamp": 684.4843601090313
  },
  {
    "coordinates": [
      5.27448,
      -3.96498
    ],
    "timestamp": 686.7425694696632
  },
  {
    "coordinates": [
      5.27481,
      -3.9652
    ],
    "timestamp": 690.0227776363058
  },
  {
    "coordinates": [
      5.27481,
      -3.9652
    ],
    "timestamp": 690.0227776363058
  },
  {
    "coordinates": [
      5.27521,
      -3.96546
    ],
    "timestamp": 696.4698917371895
  },
  {
    "coordinates": [
      5.27536,
      -3.96556
    ],
    "timestamp": 698.9060262668556
  },
  {
    "coordinates": [
      5.27591,
      -3.96598
    ],
    "timestamp": 708.2551330080163
  },
  {
    "coordinates": [
      5.27622,
      -3.96623
    ],
    "timestamp": 713.634750802469
  },
  {
    "coordinates": [
      5.27643,
      -3.96642
    ],
    "timestamp": 717.45934064369
  },
  {
    "coordinates": [
      5.27646,
      -3.96645
    ],
    "timestamp": 718.0323150935843
  },
  {
    "coordinates": [
      5.27653,
      -3.96651
    ],
    "timestamp": 719.277552271726
  },
  {
    "coordinates": [
      5.2767,
      -3.96669
    ],
    "timestamp": 722.6201361377733
  },
  {
    "coordinates": [
      5.27691,
      -3.96688
    ],
    "timestamp": 726.4447259789944
  },
  {
    "coordinates": [
      5.27713,
      -3.96708
    ],
    "timestamp": 730.460036575637
  },
  {
    "coordinates": [
      5.27724,
      -3.96718
    ],
    "timestamp": 732.4676752556005
  },
  {
    "coordinates": [
      5.27736,
      -3.96728
    ],
    "timestamp": 734.5776035928699
  },
  {
    "coordinates": [
      5.27749,
      -3.96738
    ],
    "timestamp": 736.7933236494598
  },
  {
    "coordinates": [
      5.27761,
      -3.96747
    ],
    "timestamp": 738.8198517079448
  },
  {
    "coordinates": [
      5.27786,
      -3.96763
    ],
    "timestamp": 742.8310887578657
  },
  {
    "coordinates": [
      5.27793,
      -3.96768
    ],
    "timestamp": 743.993342275434
  },
  {
    "coordinates": [
      5.27802,
      -3.96777
    ],
    "timestamp": 745.7119162149398
  },
  {
    "coordinates": [
      5.27818,
      -3.9679
    ],
    "timestamp": 748.4966866761322
  },
  {
    "coordinates": [
      5.27832,
      -3.968
    ],
    "timestamp": 750.8212798280439
  },
  {
    "coordinates": [
      5.27847,
      -3.96809
    ],
    "timestamp": 753.1855210117803
  },
  {
    "coordinates": [
      5.2786,
      -3.96816
    ],
    "timestamp": 755.1814260318539
  },
  {
    "coordinates": [
      5.27884,
      -3.96828
    ],
    "timestamp": 758.8090626570994
  },
  {
    "coordinates": [
      5.27904,
      -3.96838
    ],
    "timestamp": 761.832076010139
  },
  {
    "coordinates": [
      5.27934,
      -3.9685
    ],
    "timestamp": 766.2014805888989
  },
  {
    "coordinates": [
      5.27951,
      -3.96856
    ],
    "timestamp": 768.6396411925657
  },
  {
    "coordinates": [
      5.27974,
      -3.96864
    ],
    "timestamp": 771.9331352079805
  },
  {
    "coordinates": [
      5.28005,
      -3.96873
    ],
    "timestamp": 776.299469125989
  },
  {
    "coordinates": [
      5.28067,
      -3.96889
    ],
    "timestamp": 784.9611525821255
  },
  {
    "coordinates": [
      5.28126,
      -3.96901
    ],
    "timestamp": 793.1064356781661
  },
  {
    "coordinates": [
      5.28177,
      -3.96913
    ],
    "timestamp": 800.1940394877241
  },
  {
    "coordinates": [
      5.28223,
      -3.96924
    ],
    "timestamp": 806.5922402727541
  },
  {
    "coordinates": [
      5.28306,
      -3.96944
    ],
    "timestamp": 818.1416028511426
  },
  {
    "coordinates": [
      5.28329,
      -3.9695
    ],
    "timestamp": 821.3569781991735
  },
  {
    "coordinates": [
      5.28397,
      -3.96965
    ],
    "timestamp": 830.7772940321734
  },
  {
    "coordinates": [
      5.28465,
      -3.96982
    ],
    "timestamp": 840.2590841883558
  },
  {
    "coordinates": [
      5.28613,
      -3.97017
    ],
    "timestamp": 860.8324752065773
  },
  {
    "coordinates": [
      5.28631,
      -3.97021
    ],
    "timestamp": 863.326965293736
  },
  {
    "coordinates": [
      5.28723,
      -3.97042
    ],
    "timestamp": 876.0928409300238
  },
  {
    "coordinates": [
      5.28757,
      -3.97049
    ],
    "timestamp": 880.7889954573533
  },
  {
    "coordinates": [
      5.2882,
      -3.97062
    ],
    "timestamp": 889.4915051046762
  },
  {
    "coordinates": [
      5.28845,
      -3.97068
    ],
    "timestamp": 892.9694513051422
  },
  {
    "coordinates": [
      5.28877,
      -3.97077
    ],
    "timestamp": 897.4659156350169
  },
  {
    "coordinates": [
      5.28912,
      -3.97085
    ],
    "timestamp": 902.322821645561
  },
  {
    "coordinates": [
      5.28934,
      -3.97092
    ],
    "timestamp": 905.4454437170316
  },
  {
    "coordinates": [
      5.28957,
      -3.97098
    ],
    "timestamp": 908.6608398176537
  },
  {
    "coordinates": [
      5.28977,
      -3.97106
    ],
    "timestamp": 911.5737558413522
  },
  {
    "coordinates": [
      5.28989,
      -3.9711
    ],
    "timestamp": 913.2845076925021
  },
  {
    "coordinates": [
      5.2901,
      -3.97122
    ],
    "timestamp": 916.5537416717053
  },
  {
    "coordinates": [
      5.29026,
      -3.97134
    ],
    "timestamp": 919.2557406678576
  },
  {
    "coordinates": [
      5.2904,
      -3.97145
    ],
    "timestamp": 921.6609186840955
  },
  {
    "coordinates": [
      5.29048,
      -3.97153
    ],
    "timestamp": 923.1884428923228
  },
  {
    "coordinates": [
      5.29059,
      -3.97167
    ],
    "timestamp": 925.591206028783
  },
  {
    "coordinates": [
      5.29073,
      -3.97184
    ],
    "timestamp": 928.5635113383892
  },
  {
    "coordinates": [
      5.29089,
      -3.9721
    ],
    "timestamp": 932.6815386035836
  },
  {
    "coordinates": [
      5.29101,
      -3.97228
    ],
    "timestamp": 935.6001072918816
  },
  {
    "coordinates": [
      5.29109,
      -3.9724
    ],
    "timestamp": 937.5458006980532
  },
  {
    "coordinates": [
      5.29115,
      -3.9725
    ],
    "timestamp": 939.1188208257959
  },
  {
    "coordinates": [
      5.2914,
      -3.97296
    ],
    "timestamp": 946.1795417892954
  },
  {
    "coordinates": [
      5.29159,
      -3.97332
    ],
    "timestamp": 951.6690874680202
  },
  {
    "coordinates": [
      5.29178,
      -3.97368
    ],
    "timestamp": 957.1586331467449
  },
  {
    "coordinates": [
      5.29192,
      -3.97393
    ],
    "timestamp": 961.0230909328981
  },
  {
    "coordinates": [
      5.29265,
      -3.97523
    ],
    "timestamp": 981.1314162069934
  },
  {
    "coordinates": [
      5.29358,
      -3.9769
    ],
    "timestamp": 1006.9113764553842
  },
  {
    "coordinates": [
      5.29407,
      -3.97777
    ],
    "timestamp": 1020.3781838254799
  },
  {
    "coordinates": [
      5.29456,
      -3.97859
    ],
    "timestamp": 1033.2629020518639
  },
  {
    "coordinates": [
      5.29478,
      -3.97898
    ],
    "timestamp": 1039.3020379920597
  },
  {
    "coordinates": [
      5.29567,
      -3.9806
    ],
    "timestamp": 1064.230206484011
  },
  {
    "coordinates": [
      5.296,
      -3.98121
    ],
    "timestamp": 1073.5834376875232
  },
  {
    "coordinates": [
      5.29618,
      -3.98152
    ],
    "timestamp": 1078.4183532077209
  },
  {
    "coordinates": [
      5.29623,
      -3.98161
    ],
    "timestamp": 1079.8068392169234
  },
  {
    "coordinates": [
      5.29625,
      -3.98165
    ],
    "timestamp": 1080.4098859319467
  },
  {
    "coordinates": [
      5.29633,
      -3.98178
    ],
    "timestamp": 1082.4689157682528
  },
  {
    "coordinates": [
      5.29634,
      -3.98182
    ],
    "timestamp": 1083.024507173982
  },
  {
    "coordinates": [
      5.29653,
      -3.98217
    ],
    "timestamp": 1088.3953607619871
  },
  {
    "coordinates": [
      5.29676,
      -3.98257
    ],
    "timestamp": 1094.6186201559237
  },
  {
    "coordinates": [
      5.29685,
      -3.98273
    ],
    "timestamp": 1097.0945031017736
  },
  {
    "coordinates": [
      5.29719,
      -3.98332
    ],
    "timestamp": 1106.278885300361
  },
  {
    "coordinates": [
      5.29738,
      -3.98367
    ],
    "timestamp": 1111.649738888366
  },
  {
    "coordinates": [
      5.29827,
      -3.98524
    ],
    "timestamp": 1135.9901678367728
  },
  {
    "coordinates": [
      5.29827,
      -3.98524
    ],
    "timestamp": 1135.9901678367728
  },
  {
    "coordinates": [
      5.29902,
      -3.98662
    ],
    "timestamp": 1164.9722761449798
  },
  {
    "coordinates": [
      5.29919,
      -3.98695
    ],
    "timestamp": 1171.8215471907315
  },
  {
    "coordinates": [
      5.29969,
      -3.98787
    ],
    "timestamp": 1191.142937643319
  },
  {
    "coordinates": [
      5.29987,
      -3.98818
    ],
    "timestamp": 1197.7582439451187
  },
  {
    "coordinates": [
      5.30033,
      -3.98902
    ],
    "timestamp": 1215.4304361128795
  },
  {
    "coordinates": [
      5.30038,
      -3.9891
    ],
    "timestamp": 1217.171574317383
  },
  {
    "coordinates": [
      5.30054,
      -3.9894
    ],
    "timestamp": 1223.4452169809842
  },
  {
    "coordinates": [
      5.3006,
      -3.98952
    ],
    "timestamp": 1225.9205620988332
  },
  {
    "coordinates": [
      5.30086,
      -3.98999
    ],
    "timestamp": 1235.8320305815107
  },
  {
    "coordinates": [
      5.30097,
      -3.99019
    ],
    "timestamp": 1240.0439672449766
  },
  {
    "coordinates": [
      5.30104,
      -3.99031
    ],
    "timestamp": 1242.60776297681
  },
  {
    "coordinates": [
      5.30123,
      -3.99066
    ],
    "timestamp": 1249.956350084587
  },
  {
    "coordinates": [
      5.3013,
      -3.99078
    ],
    "timestamp": 1252.5200970912674
  },
  {
    "coordinates": [
      5.30134,
      -3.99087
    ],
    "timestamp": 1254.3369322777262
  },
  {
    "coordinates": [
      5.30136,
      -3.99093
    ],
    "timestamp": 1255.5033928620949
  },
  {
    "coordinates": [
      5.30137,
      -3.991
    ],
    "timestamp": 1256.8070085059624
  },
  {
    "coordinates": [
      5.30138,
      -3.99104
    ],
    "timestamp": 1257.5673574147927
  },
  {
    "coordinates": [
      5.30138,
      -3.99116
    ],
    "timestamp": 1259.7794542010195
  },
  {
    "coordinates": [
      5.30136,
      -3.99129
    ],
    "timestamp": 1262.204375105282
  },
  {
    "coordinates": [
      5.30136,
      -3.99136
    ],
    "timestamp": 1263.4947958216787
  },
  {
    "coordinates": [
      5.30136,
      -3.99142
    ],
    "timestamp": 1264.6009006847275
  },
  {
    "coordinates": [
      5.30138,
      -3.99152
    ],
    "timestamp": 1266.48119059325
  },
  {
    "coordinates": [
      5.30141,
      -3.9916
    ],
    "timestamp": 1268.0570753036543
  },
  {
    "coordinates": [
      5.30142,
      -3.99168
    ],
    "timestamp": 1269.543459442139
  },
  {
    "coordinates": [
      5.30145,
      -3.99182
    ],
    "timestamp": 1272.1833070884816
  },
  {
    "coordinates": [
      5.30146,
      -3.99203
    ],
    "timestamp": 1276.058955280603
  },
  {
    "coordinates": [
      5.30147,
      -3.99222
    ],
    "timestamp": 1279.5663954529593
  },
  {
    "coordinates": [
      5.30146,
      -3.99233
    ],
    "timestamp": 1281.6026541995477
  },
  {
    "coordinates": [
      5.30146,
      -3.99241
    ],
    "timestamp": 1283.0773948022315
  },
  {
    "coordinates": [
      5.30133,
      -3.99332
    ],
    "timestamp": 1300.0243834302353
  },
  {
    "coordinates": [
      5.30131,
      -3.9934
    ],
    "timestamp": 1301.5448347881309
  },
  {
    "coordinates": [
      5.30129,
      -3.99345
    ],
    "timestamp": 1302.538247693369
  },
  {
    "coordinates": [
      5.30128,
      -3.99349
    ],
    "timestamp": 1303.29843229125
  },
  {
    "coordinates": [
      5.30125,
      -3.99355
    ],
    "timestamp": 1304.5360796170412
  },
  {
    "coordinates": [
      5.30122,
      -3.99358
    ],
    "timestamp": 1305.319729709185
  },
  {
    "coordinates": [
      5.30118,
      -3.99363
    ],
    "timestamp": 1306.5021451778196
  },
  {
    "coordinates": [
      5.30116,
      -3.99365
    ],
    "timestamp": 1307.0247113957594
  },
  {
    "coordinates": [
      5.30114,
      -3.99368
    ],
    "timestamp": 1307.6902689505694
  },
  {
    "coordinates": [
      5.30111,
      -3.99374
    ],
    "timestamp": 1308.9279162763605
  },
  {
    "coordinates": [
      5.30109,
      -3.99378
    ],
    "timestamp": 1309.7528799044962
  },
  {
    "coordinates": [
      5.30108,
      -3.99383
    ],
    "timestamp": 1310.6930580764927
  },
  {
    "coordinates": [
      5.30107,
      -3.99388
    ],
    "timestamp": 1311.633236248489
  },
  {
    "coordinates": [
      5.30104,
      -3.994
    ],
    "timestamp": 1313.9140091365507
  },
  {
    "coordinates": [
      5.30101,
      -3.99413
    ],
    "timestamp": 1316.3740156081653
  },
  {
    "coordinates": [
      5.30099,
      -3.99424
    ],
    "timestamp": 1318.4353947310472
  },
  {
    "coordinates": [
      5.30096,
      -3.99435
    ],
    "timestamp": 1320.5378752889608
  },
  {
    "coordinates": [
      5.30093,
      -3.99445
    ],
    "timestamp": 1322.4632013882351
  },
  {
    "coordinates": [
      5.30084,
      -3.99472
    ],
    "timestamp": 1327.7119289280383
  },
  {
    "coordinates": [
      5.30067,
      -3.9952
    ],
    "timestamp": 1337.1034608923205
  },
  {
    "coordinates": [
      5.30064,
      -3.99528
    ],
    "timestamp": 1338.6793456027249
  },
  {
    "coordinates": [
      5.30061,
      -3.99537
    ],
    "timestamp": 1340.4289293826673
  },
  {
    "coordinates": [
      5.30059,
      -3.99544
    ],
    "timestamp": 1341.7714449140976
  },
  {
    "coordinates": [
      5.30057,
      -3.99554
    ],
    "timestamp": 1343.6516683848017
  },
  {
    "coordinates": [
      5.30056,
      -3.99562
    ],
    "timestamp": 1345.1379684779306
  },
  {
    "coordinates": [
      5.30055,
      -3.99576
    ],
    "timestamp": 1347.725480886241
  },
  {
    "coordinates": [
      5.30053,
      -3.99605
    ],
    "timestamp": 1353.0842255943307
  },
  {
    "coordinates": [
      5.30052,
      -3.99614
    ],
    "timestamp": 1354.7535723975404
  },
  {
    "coordinates": [
      5.30051,
      -3.99619
    ],
    "timestamp": 1355.6937505695369
  },
  {
    "coordinates": [
      5.30049,
      -3.99627
    ],
    "timestamp": 1357.2142019274324
  },
  {
    "coordinates": [
      5.30047,
      -3.99632
    ],
    "timestamp": 1358.2076148326705
  },
  {
    "coordinates": [
      5.30039,
      -3.99657
    ],
    "timestamp": 1363.0483298728457
  },
  {
    "coordinates": [
      5.30016,
      -3.99723
    ],
    "timestamp": 1375.9386088525898
  },
  {
    "coordinates": [
      5.30002,
      -3.99763
    ],
    "timestamp": 1383.7546149773184
  },
  {
    "coordinates": [
      5.29992,
      -3.99793
    ],
    "timestamp": 1389.5865966103204
  },
  {
    "coordinates": [
      5.29989,
      -3.998
    ],
    "timestamp": 1390.9914946139447
  },
  {
    "coordinates": [
      5.29987,
      -3.99806
    ],
    "timestamp": 1392.1579551983134
  },
  {
    "coordinates": [
      5.29985,
      -3.99815
    ],
    "timestamp": 1393.8579266083334
  },
  {
    "coordinates": [
      5.29941,
      -3.99934
    ],
    "timestamp": 1417.258428495865
  },
  {
    "coordinates": [
      5.29911,
      -4.00019
    ],
    "timestamp": 1433.882863677453
  },
  {
    "coordinates": [
      5.29905,
      -4.00035
    ],
    "timestamp": 1437.0345934630861
  },
  {
    "coordinates": [
      5.29864,
      -4.00153
    ],
    "timestamp": 1460.0734947442431
  },
  {
    "coordinates": [
      5.29858,
      -4.00173
    ],
    "timestamp": 1463.9240820596526
  },
  {
    "coordinates": [
      5.29847,
      -4.00211
    ],
    "timestamp": 1471.2191819991972
  },
  {
    "coordinates": [
      5.29838,
      -4.00242
    ],
    "timestamp": 1477.1717949629897
  },
  {
    "coordinates": [
      5.29838,
      -4.00242
    ],
    "timestamp": 1477.1717949629897
  },
  {
    "coordinates": [
      5.29865,
      -4.00243
    ],
    "timestamp": 1484.898159053586
  },
  {
    "coordinates": [
      5.29873,
      -4.00241
    ],
    "timestamp": 1487.2558277979904
  },
  {
    "coordinates": [
      5.29888,
      -4.0024
    ],
    "timestamp": 1491.5547563379123
  },
  {
    "coordinates": [
      5.29904,
      -4.00241
    ],
    "timestamp": 1496.1390759099904
  },
  {
    "coordinates": [
      5.29935,
      -4.00242
    ],
    "timestamp": 1505.008612106921
  },
  {
    "coordinates": [
      5.29957,
      -4.00246
    ],
    "timestamp": 1511.4021038317703
  },
  {
    "coordinates": [
      5.30007,
      -4.0026
    ],
    "timestamp": 1526.245777039372
  },
  {
    "coordinates": [
      5.30025,
      -4.00265
    ],
    "timestamp": 1531.5864912259754
  },
  {
    "coordinates": [
      5.30073,
      -4.00282
    ],
    "timestamp": 1546.1414291169388
  },
  {
    "coordinates": [
      5.30118,
      -4.00299
    ],
    "timestamp": 1559.8902696162224
  },
  {
    "coordinates": [
      5.30154,
      -4.00313
    ],
    "timestamp": 1570.9299686503439
  },
  {
    "coordinates": [
      5.30161,
      -4.00315
    ],
    "timestamp": 1573.011274696996
  },
  {
    "coordinates": [
      5.30203,
      -4.0033
    ],
    "timestamp": 1585.7586886231265
  },
  {
    "coordinates": [
      5.30245,
      -4.00344
    ],
    "timestamp": 1598.4135751275373
  },
  {
    "coordinates": [
      5.30289,
      -4.00357
    ],
    "timestamp": 1611.5293207592895
  },
  {
    "coordinates": [
      5.30331,
      -4.0037
    ],
    "timestamp": 1624.0974266343162
  },
  {
    "coordinates": [
      5.30377,
      -4.00387
    ],
    "timestamp": 1638.1142625976504
  },
  {
    "coordinates": [
      5.30377,
      -4.00387
    ],
    "timestamp": 1638.1142625976504
  },
  {
    "coordinates": [
      5.30361,
      -4.00431
    ],
    "timestamp": 1654.5877118641472
  },
  {
    "coordinates": [
      5.30351,
      -4.00459
    ],
    "timestamp": 1665.0489654584665
  }
]

const TRIPS = [
  {
    trip: [
      {
        "coordinates": [
          5.2563,
          -3.92892
        ],
        "timestamp": 0
      },
      {
        "coordinates": [
          5.25986,
          -3.92746
        ],
        "timestamp": 56
      },
      {
        "coordinates": [
          5.2619,
          -3.92661
        ],
        "timestamp": 88
      },
      {
        "coordinates": [
          5.26344,
          -3.92597
        ],
        "timestamp": 112
      },
      {
        "coordinates": [
          5.26377,
          -3.927
        ],
        "timestamp": 127
      },
      {
        "coordinates": [
          5.26409,
          -3.92794
        ],
        "timestamp": 142
      },
      {
        "coordinates": [
          5.26412,
          -3.92809
        ],
        "timestamp": 144
      },
      {
        "coordinates": [
          5.26399,
          -3.92875
        ],
        "timestamp": 154
      },
      {
        "coordinates": [
          5.26396,
          -3.92898
        ],
        "timestamp": 157
      },
      {
        "coordinates": [
          5.26396,
          -3.92977
        ],
        "timestamp": 168
      },
      {
        "coordinates": [
          5.26397,
          -3.93089
        ],
        "timestamp": 184
      },
      {
        "coordinates": [
          5.26392,
          -3.93108
        ],
        "timestamp": 187
      },
      {
        "coordinates": [
          5.26382,
          -3.93134
        ],
        "timestamp": 191
      },
      {
        "coordinates": [
          5.2636,
          -3.93167
        ],
        "timestamp": 197
      },
      {
        "coordinates": [
          5.26351,
          -3.93198
        ],
        "timestamp": 202
      },
      {
        "coordinates": [
          5.26325,
          -3.93208
        ],
        "timestamp": 206
      },
      {
        "coordinates": [
          5.26218,
          -3.9325
        ],
        "timestamp": 222
      },
      {
        "coordinates": [
          5.25991,
          -3.93338
        ],
        "timestamp": 258
      },
      {
        "coordinates": [
          5.25886,
          -3.93384
        ],
        "timestamp": 274
      },
      {
        "coordinates": [
          5.25896,
          -3.93407
        ],
        "timestamp": 278
      },
      {
        "coordinates": [
          5.25804,
          -3.93444
        ],
        "timestamp": 292
      },
      {
        "coordinates": [
          5.25772,
          -3.93459
        ],
        "timestamp": 297
      },
      {
        "coordinates": [
          5.2577,
          -3.93467
        ],
        "timestamp": 298
      },
      {
        "coordinates": [
          5.25764,
          -3.93516
        ],
        "timestamp": 306
      },
      {
        "coordinates": [
          5.25762,
          -3.93521
        ],
        "timestamp": 306
      },
      {
        "coordinates": [
          5.25738,
          -3.93532
        ],
        "timestamp": 310
      },
      {
        "coordinates": [
          5.25755,
          -3.93574
        ],
        "timestamp": 317
      },
      {
        "coordinates": [
          5.25819,
          -3.93728
        ],
        "timestamp": 341
      },
      {
        "coordinates": [
          5.26079,
          -3.94359
        ],
        "timestamp": 439
      },
      {
        "coordinates": [
          5.26193,
          -3.9463
        ],
        "timestamp": 482
      },
      {
        "coordinates": [
          5.26361,
          -3.95032
        ],
        "timestamp": 544
      },
      {
        "coordinates": [
          5.26555,
          -3.95499
        ],
        "timestamp": 617
      },
      {
        "coordinates": [
          5.26713,
          -3.95884
        ],
        "timestamp": 677
      },
      {
        "coordinates": [
          5.26725,
          -3.95919
        ],
        "timestamp": 683
      },
      {
        "coordinates": [
          5.26733,
          -3.95953
        ],
        "timestamp": 688
      },
      {
        "coordinates": [
          5.26747,
          -3.95997
        ],
        "timestamp": 695
      },
      {
        "coordinates": [
          5.26779,
          -3.96069
        ],
        "timestamp": 706
      },
      {
        "coordinates": [
          5.26794,
          -3.961
        ],
        "timestamp": 711
      },
      {
        "coordinates": [
          5.26808,
          -3.96124
        ],
        "timestamp": 715
      },
      {
        "coordinates": [
          5.26818,
          -3.96139
        ],
        "timestamp": 717
      },
      {
        "coordinates": [
          5.26833,
          -3.96153
        ],
        "timestamp": 720
      },
      {
        "coordinates": [
          5.26857,
          -3.96172
        ],
        "timestamp": 725
      },
      {
        "coordinates": [
          5.26874,
          -3.96184
        ],
        "timestamp": 728
      },
      {
        "coordinates": [
          5.27086,
          -3.96299
        ],
        "timestamp": 763
      },
      {
        "coordinates": [
          5.27448,
          -3.96498
        ],
        "timestamp": 822
      },
      {
        "coordinates": [
          5.27521,
          -3.96546
        ],
        "timestamp": 835
      },
      {
        "coordinates": [
          5.27591,
          -3.96598
        ],
        "timestamp": 848
      },
      {
        "coordinates": [
          5.27653,
          -3.96651
        ],
        "timestamp": 860
      },
      {
        "coordinates": [
          5.27691,
          -3.96688
        ],
        "timestamp": 867
      },
      {
        "coordinates": [
          5.27724,
          -3.96718
        ],
        "timestamp": 874
      },
      {
        "coordinates": [
          5.27749,
          -3.96738
        ],
        "timestamp": 878
      },
      {
        "coordinates": [
          5.27786,
          -3.96763
        ],
        "timestamp": 885
      },
      {
        "coordinates": [
          5.27802,
          -3.96777
        ],
        "timestamp": 888
      },
      {
        "coordinates": [
          5.27832,
          -3.968
        ],
        "timestamp": 893
      },
      {
        "coordinates": [
          5.2786,
          -3.96816
        ],
        "timestamp": 898
      },
      {
        "coordinates": [
          5.27904,
          -3.96838
        ],
        "timestamp": 905
      },
      {
        "coordinates": [
          5.27951,
          -3.96856
        ],
        "timestamp": 912
      },
      {
        "coordinates": [
          5.28005,
          -3.96873
        ],
        "timestamp": 921
      },
      {
        "coordinates": [
          5.28067,
          -3.96889
        ],
        "timestamp": 930
      },
      {
        "coordinates": [
          5.28126,
          -3.96901
        ],
        "timestamp": 938
      },
      {
        "coordinates": [
          5.28223,
          -3.96924
        ],
        "timestamp": 953
      },
      {
        "coordinates": [
          5.28465,
          -3.96982
        ],
        "timestamp": 989
      },
      {
        "coordinates": [
          5.28631,
          -3.97021
        ],
        "timestamp": 1014
      },
      {
        "coordinates": [
          5.28757,
          -3.97049
        ],
        "timestamp": 1032
      },
      {
        "coordinates": [
          5.28845,
          -3.97068
        ],
        "timestamp": 1045
      },
      {
        "coordinates": [
          5.28912,
          -3.97085
        ],
        "timestamp": 1055
      },
      {
        "coordinates": [
          5.28957,
          -3.97098
        ],
        "timestamp": 1062
      },
      {
        "coordinates": [
          5.28989,
          -3.9711
        ],
        "timestamp": 1067
      },
      {
        "coordinates": [
          5.29026,
          -3.97134
        ],
        "timestamp": 1073
      },
      {
        "coordinates": [
          5.29048,
          -3.97153
        ],
        "timestamp": 1078
      },
      {
        "coordinates": [
          5.29073,
          -3.97184
        ],
        "timestamp": 1083
      },
      {
        "coordinates": [
          5.29101,
          -3.97228
        ],
        "timestamp": 1091
      },
      {
        "coordinates": [
          5.29115,
          -3.9725
        ],
        "timestamp": 1095
      },
      {
        "coordinates": [
          5.29159,
          -3.97332
        ],
        "timestamp": 1108
      },
      {
        "coordinates": [
          5.29358,
          -3.9769
        ],
        "timestamp": 1167
      },
      {
        "coordinates": [
          5.29456,
          -3.97859
        ],
        "timestamp": 1195
      },
      {
        "coordinates": [
          5.29567,
          -3.9806
        ],
        "timestamp": 1229
      },
      {
        "coordinates": [
          5.29625,
          -3.98165
        ],
        "timestamp": 1246
      },
      {
        "coordinates": [
          5.29676,
          -3.98257
        ],
        "timestamp": 1261
      },
      {
        "coordinates": [
          5.29827,
          -3.98524
        ],
        "timestamp": 1305
      },
      {
        "coordinates": [
          5.29902,
          -3.98662
        ],
        "timestamp": 1328
      },
      {
        "coordinates": [
          5.29919,
          -3.98695
        ],
        "timestamp": 1333
      },
      {
        "coordinates": [
          5.29987,
          -3.98818
        ],
        "timestamp": 1354
      },
      {
        "coordinates": [
          5.3006,
          -3.98952
        ],
        "timestamp": 1376
      },
      {
        "coordinates": [
          5.30123,
          -3.99066
        ],
        "timestamp": 1394
      },
      {
        "coordinates": [
          5.30134,
          -3.99087
        ],
        "timestamp": 1398
      },
      {
        "coordinates": [
          5.30137,
          -3.991
        ],
        "timestamp": 1400
      },
      {
        "coordinates": [
          5.30136,
          -3.99136
        ],
        "timestamp": 1405
      },
      {
        "coordinates": [
          5.30142,
          -3.99168
        ],
        "timestamp": 1410
      },
      {
        "coordinates": [
          5.30146,
          -3.99203
        ],
        "timestamp": 1415
      },
      {
        "coordinates": [
          5.30146,
          -3.99233
        ],
        "timestamp": 1419
      },
      {
        "coordinates": [
          5.30133,
          -3.99332
        ],
        "timestamp": 1433
      },
      {
        "coordinates": [
          5.30129,
          -3.99345
        ],
        "timestamp": 1435
      },
      {
        "coordinates": [
          5.30125,
          -3.99355
        ],
        "timestamp": 1437
      },
      {
        "coordinates": [
          5.30118,
          -3.99363
        ],
        "timestamp": 1439
      },
      {
        "coordinates": [
          5.30109,
          -3.99378
        ],
        "timestamp": 1441
      },
      {
        "coordinates": [
          5.30101,
          -3.99413
        ],
        "timestamp": 1446
      },
      {
        "coordinates": [
          5.30093,
          -3.99445
        ],
        "timestamp": 1451
      },
      {
        "coordinates": [
          5.30061,
          -3.99537
        ],
        "timestamp": 1465
      },
      {
        "coordinates": [
          5.30057,
          -3.99554
        ],
        "timestamp": 1468
      },
      {
        "coordinates": [
          5.30055,
          -3.99576
        ],
        "timestamp": 1471
      },
      {
        "coordinates": [
          5.30052,
          -3.99614
        ],
        "timestamp": 1476
      },
      {
        "coordinates": [
          5.30049,
          -3.99627
        ],
        "timestamp": 1478
      },
      {
        "coordinates": [
          5.30002,
          -3.99763
        ],
        "timestamp": 1499
      },
      {
        "coordinates": [
          5.29985,
          -3.99815
        ],
        "timestamp": 1507
      },
      {
        "coordinates": [
          5.29864,
          -4.00153
        ],
        "timestamp": 1559
      },
      {
        "coordinates": [
          5.29847,
          -4.00211
        ],
        "timestamp": 1567
      },
      {
        "coordinates": [
          5.29838,
          -4.00242
        ],
        "timestamp": 1572
      },
      {
        "coordinates": [
          5.29865,
          -4.00243
        ],
        "timestamp": 1576
      },
      {
        "coordinates": [
          5.29888,
          -4.0024
        ],
        "timestamp": 1579
      },
      {
        "coordinates": [
          5.29935,
          -4.00242
        ],
        "timestamp": 1586
      },
      {
        "coordinates": [
          5.29957,
          -4.00246
        ],
        "timestamp": 1589
      },
      {
        "coordinates": [
          5.30007,
          -4.0026
        ],
        "timestamp": 1597
      },
      {
        "coordinates": [
          5.30073,
          -4.00282
        ],
        "timestamp": 1607
      },
      {
        "coordinates": [
          5.30203,
          -4.0033
        ],
        "timestamp": 1627
      },
      {
        "coordinates": [
          5.30289,
          -4.00357
        ],
        "timestamp": 1640
      },
      {
        "coordinates": [
          5.30377,
          -4.00387
        ],
        "timestamp": 1653
      },
      {
        "coordinates": [
          5.30351,
          -4.00459
        ],
        "timestamp": 1664
      }
    ]
  }
]

trip.forEach((item,i) => {
  item.timestamp = Number((item.timestamp).toFixed(0))
  TRIPS[0].trip.push(item)
})

// const TRIPS = [];
// NYC_JSON.features.forEach(trip => {
//   const start = trip.properties.start_time;
//   const end = trip.properties.end_time;
//   const duration = end - start;
//   const totalLength = geojsonLength(trip.geometry);
//   let next_point;
//   let m;
//   let stamp = 0;
//
//
//   const waypoints = trip.geometry.coordinates.map((item, i) => {
//     if (trip.geometry.coordinates[i + 1]) {
//       next_point = trip.geometry.coordinates[i + 1];
//       m = distance(item[0], item[1], next_point[0], next_point[1], 'K') * 1000;
//       stamp = stamp + (duration * m / totalLength);
//     }
//
//     let timestamp = stamp - (duration * m / totalLength)
//     return {
//       coordinates: item,
//       timestamp: timestamp.toFixed(3),
//       distance: m || 0,
//     }
//   })
//
//
//   TRIPS.push({trip: waypoints})
// })


// let duration = 0;
// const TRIP = TRIP_CSV.map((row)=> {
//   duration = duration + row.duration;
//   const waypoint = {
//     coordinates: [row.lat, row.lang],
//     timestamp: duration - row.duration,
//     duration: parseFloat(row.duration).toFixed(4),
//   }
//
//   return waypoint
// });
// const TRIPS = [{trip: TRIP}];

// console.log('TRIP', TRIPS)


// coordinates: (3) [-3.93435, 5.25075, 0]
// distance: 107.132515464383
// timestamp: 23.43295098406461

// let timestamp = 0;
// const TRIP = TRIPS_CSV.map(trip => {
//   trip.coordinates = [trip.latitude, trip.longitude]
//   timestamp = timestamp + trip.duration;
//   return {
//     coordinates: trip.coordinates,
//     timestamp: timestamp
//   };
// })


// const TRIPS = [
//   {
//     coordinates: [
//       ...TRIP
//     ]
//   }
// ]

// console.log(TRIPS)

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ';

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [254, 120, 78]
];

const material = new PhongMaterial({
  ambient: 0.8,
  diffuse: 0.3,
  shininess: 60,
  specularColor: [51, 51, 51]
});

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 2,
  position: [-0.144528, 49.739968, 80000],
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
});

const transitionInterpolator = new LinearInterpolator(['bearing']);

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: {
        latitude: 5.322635048060814,
        longitude: -4.013425118889425,
        zoom: 12,
        bearing: 0,
        pitch: 12 * 3,
      },
      layers: {
        hexagon: {
          elevationScale: 0,
          coverage: 1,
          opacity: 0
        }
      },
      endpoint: '192.168.68.119:3030',
      time: 100,
    };
    this._fonViewStateChange = this._onViewStateChange.bind(this);
    this._flyTo = this._flyTo.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
    this._addData = this._addData.bind(this);
  }

  _onViewStateChange({viewState}) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * 3;
    this.setState({viewState});
  }

  _renderLayers = () => {
    const {hexagon} = this.state.layers;
    return [
      new GeoJsonLayer({
        id: 'communes-stroke',
        data: COMMUNES_JSON,
        stroked: true,
        filled: false,
        opacity: 0.4,
        lineWidthMinPixels: 2,
        getLineColor: [32, 201, 151],
      }),
      new GeoJsonLayer({
        id: 'communes-fill',
        data: COMMUNES_JSON,
        stroked: true,
        filled: true,
        opacity: 0,
        pickable: true,
        onClick: (info) => {
          const {bounds} = info.object.properties;
          if (bounds) this._flyTo(bounds);
          this.props.clickedLayer(info);
        }
      }),
      new ScatterplotLayer({
        id: 'incidents',
        data: INCIDENTS_JSON.incidents,
        getRadius: d => d.properties.severity * 10,
        getPosition: d => d.geometry.coordinates,
        getFillColor: d => {
          if (d.properties.status === 'detected') return [254, 120, 78];
          if (d.properties.status === 'responding') return [254, 237, 177];
          if (d.properties.status === 'clearing') return [32, 201, 151];
          return colorRange[2]
        },
        extruded: true,
        getFilterValue: d => [
          d.properties.start_timestamp,
          d.properties.end_timestamp
        ],
        filterRange: [
          [0, this.props.time],
          [this.props.time, 5000]
        ],
        filterSoftRange: [
          [0, this.props.time - 100],
          [this.props.time + 100, 5000]
        ],
        extensions: [
          new DataFilterExtension({filterSize: 2})
        ]
      }),
      new HexagonLayer({
        id: 'hex-layer',
        colorRange,
        material,
        data: DOTS_JSON.features,
        pickable: true,
        opacity: hexagon.opacity,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthMinPixels: 1,
        getPosition: d => d.geometry.coordinates,
        elevationScale: hexagon.elevationScale,
        coverage: 1,
        radius: 30,
        transitions: {
          elevationScale: 2400,
          coverage: 1200,
          opacity: 500
        },
        getFillColor: d => [32, 201, 151],
        onClick: e => console.log(e),
      }),
      new TripsLayer({
        id: 'trips-layer',
        data: TRIPS,
        getPath: d => {
          return d.trip.map(p => {
            return [p.coordinates[1], p.coordinates[0]]
          })
        },
        getTimestamps: d => d.trip.map(p => {
          return p.timestamp
        }),
        getColor: [253, 128, 93],
        opacity: 1,
        widthMinPixels: 20,
        rounded: true,
        trailLength: 500,
        currentTime: this.props.time,
      })
    ]
  }

  _addData = () => {
    const state = this.state;
    state.layers.hexagon.elevationScale = 1;
    state.layers.hexagon.opacity = 1;


    setTimeout(() => this.setState(state), 4000);
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 120;
    this.setState({
      viewState: {
        ...this.state.viewState,
        bearing,
        transitionDuration: 90000,
        transitionInterpolator,
        onTransitionEnd: this._rotateCamera,
      },

    });
  }

  _flyTo(bounds) {
    if (this.props.controller) {
      const socket = socketIOClient(this.state.endpoint);
      socket.emit('update', bounds);
    }

    this.setState({
      viewState: {
        ...this.state.viewState,
        longitude: bounds.longitude || this.state.viewState.longitude,
        latitude: bounds.latitude || this.state.viewState.latitude,
        zoom: bounds.zoom || this.state.viewState.zoom,
        pitch: bounds.pitch || this.state.viewState.pitch,
        bearing: 0,
        transitionDuration: 800,
        transitionInterpolator: new FlyToInterpolator({curve: 5}),
        transitionEasing: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        onTransitionEnd: this._rotateCamera
      }
    });
  }


  componentDidUpdate(prevProps) {
    if (prevProps.command !== this.props.command) {
      const result = COMMUNES_JSON.features.find(item => {
        return item.properties.name.toLowerCase() === this.props.command.trim().toLowerCase()
      })

      if (result) {
        this._flyTo(result.properties.bounds)

        this._addData();
      }
    }
  }

  componentDidMount() {
    if (!this.props.controller) {
      const socket = socketIOClient(this.state.endpoint);
      socket.on('update', (bounds) => {
        console.log('receive socket data', bounds);
        this._flyTo(bounds);
      })
    }
    setTimeout(() => {
      // this._addData()
    }, 2000)
  }

  render() {
    const {mapStyle = 'mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz'} = this.props;
    const {viewState} = this.state;

    return (
      <div>
        <DeckGL
          viewState={viewState}
          layers={this._renderLayers()}
          controller={{type: MapController, doubleClickZoom: false}}
          effects={[lightingEffect]}
          onViewStateChange={this._onViewStateChange}
        >
          <StaticMap
            id='map'
            reuseMaps
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
      </div>
    )
  }
}

export default Deck
