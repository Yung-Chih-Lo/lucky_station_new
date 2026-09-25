-- Snapshot of scripts/seed-data/metroData.json (2026-09-25).
-- Update geometry only for MRT rows already present before the deployment seed.
UPDATE stations SET schematic_x = 1054, schematic_y = 1647, label_x = 1074, label_y = 1653, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '新店';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1135, schematic_y = 1117.5, label_x = 1155, label_y = 1157.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '忠孝敦化';
--> statement-breakpoint
UPDATE stations SET schematic_x = 850, schematic_y = 1209, label_x = 850, label_y = 1247, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '小南門';
--> statement-breakpoint
UPDATE stations SET schematic_x = 856, schematic_y = 1543.5, label_x = 835, label_y = 1543.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '南勢角';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1337.5, schematic_y = 1399.5, label_x = 1337.5, label_y = 1379.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '動物園';
--> statement-breakpoint
UPDATE stations SET schematic_x = 856, schematic_y = 1492.5, label_x = 835, label_y = 1492.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '景安';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1000, schematic_y = 1026, label_x = 1000, label_y = 1064, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '松江南京';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1258, schematic_y = 1117.5, label_x = 1313, label_y = 1123.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '永春';
--> statement-breakpoint
UPDATE stations SET schematic_x = 616, schematic_y = 1063.5, label_x = 636, label_y = 1069.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '先嗇宮';
--> statement-breakpoint
UPDATE stations SET schematic_x = 719.5, schematic_y = 906, label_x = 700, label_y = 906, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '三重國小';
--> statement-breakpoint
UPDATE stations SET schematic_x = 653.5, schematic_y = 840, label_x = 634, label_y = 840, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '徐匯中學';
--> statement-breakpoint
UPDATE stations SET schematic_x = 733, schematic_y = 1248, label_x = 733, label_y = 1228, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '江子翠';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1054, schematic_y = 1543.5, label_x = 1073.5, label_y = 1543.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '七張';
--> statement-breakpoint
UPDATE stations SET schematic_x = 514, schematic_y = 1167, label_x = 493, label_y = 1167, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '輔大';
--> statement-breakpoint
UPDATE stations SET schematic_x = 719.5, schematic_y = 960, label_x = 719.5, label_y = 940, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '台北橋';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1000, schematic_y = 1209, label_x = 1020, label_y = 1187, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '東門';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1387, schematic_y = 948, label_x = 1367.5, label_y = 948, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '東湖';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1175.5, schematic_y = 1117.5, label_x = 1195.5, label_y = 1095.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '國父紀念館';
--> statement-breakpoint
UPDATE stations SET schematic_x = 445, schematic_y = 1236, label_x = 425.5, label_y = 1236, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '迴龍';
--> statement-breakpoint
UPDATE stations SET schematic_x = 610, schematic_y = 390, label_x = 630, label_y = 396, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '紅樹林';
--> statement-breakpoint
UPDATE stations SET schematic_x = 854.5, schematic_y = 633, label_x = 835, label_y = 633, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '唭哩岸';
--> statement-breakpoint
UPDATE stations SET schematic_x = 856, schematic_y = 1440, label_x = 876, label_y = 1446, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '永安市場';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1387, schematic_y = 999, label_x = 1410, label_y = 1005, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '南港軟體園區';
--> statement-breakpoint
UPDATE stations SET schematic_x = 688, schematic_y = 873, label_x = 667, label_y = 873, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '三和國中';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1216, schematic_y = 1117.5, label_x = 1236, label_y = 1157.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '市政府';
--> statement-breakpoint
UPDATE stations SET schematic_x = 856, schematic_y = 1389, label_x = 835, label_y = 1389, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '頂溪';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1054, schematic_y = 1492.5, label_x = 1054, label_y = 1472.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '大坪林';
--> statement-breakpoint
UPDATE stations SET schematic_x = 953.5, schematic_y = 1117.5, label_x = 953.5, label_y = 1155.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '善導寺';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1292.5, schematic_y = 1026, label_x = 1272.5, label_y = 1032, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '松山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1054, schematic_y = 1440, label_x = 1033, label_y = 1440, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '景美';
--> statement-breakpoint
UPDATE stations SET schematic_x = 715, schematic_y = 493.5, label_x = 695.5, label_y = 493.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '忠義';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1297, schematic_y = 1117.5, label_x = 1317, label_y = 1157.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '後山埤';
--> statement-breakpoint
UPDATE stations SET schematic_x = 691, schematic_y = 1290, label_x = 711, label_y = 1296, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '新埔';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1360, schematic_y = 1077, label_x = 1380, label_y = 1083, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '南港';
--> statement-breakpoint
UPDATE stations SET schematic_x = 628, schematic_y = 1647, label_x = 607, label_y = 1647, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '頂埔';
--> statement-breakpoint
UPDATE stations SET schematic_x = 817, schematic_y = 933, label_x = 817, label_y = 971, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '大橋頭';
--> statement-breakpoint
UPDATE stations SET schematic_x = 775, schematic_y = 1206, label_x = 755, label_y = 1184, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '龍山寺';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1054, schematic_y = 1389, label_x = 1033, label_y = 1389, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '萬隆';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1159, schematic_y = 1026, label_x = 1159, label_y = 1064, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '台北小巨蛋';
--> statement-breakpoint
UPDATE stations SET schematic_x = 751, schematic_y = 528, label_x = 730, label_y = 528, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '復興崗';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1094.5, schematic_y = 1257, label_x = 1075, label_y = 1257, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '科技大樓';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1225, schematic_y = 1026, label_x = 1240, label_y = 994, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '南京三民';
--> statement-breakpoint
UPDATE stations SET schematic_x = 685, schematic_y = 996, label_x = 665.5, label_y = 996, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '菜寮';
--> statement-breakpoint
UPDATE stations SET schematic_x = 548.5, schematic_y = 1132.5, label_x = 529, label_y = 1132.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '新莊';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1364.5, schematic_y = 844.5, label_x = 1364.5, label_y = 824.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '大湖公園';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1265.5, schematic_y = 822, label_x = 1265.5, label_y = 796.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '文德';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1054, schematic_y = 1594.5, label_x = 1074, label_y = 1600.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '新店區公所';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1094.5, schematic_y = 1209, label_x = 1094.5, label_y = 1189, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '大安';
--> statement-breakpoint
UPDATE stations SET schematic_x = 583, schematic_y = 1098, label_x = 562, label_y = 1098, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '頭前庄';
--> statement-breakpoint
UPDATE stations SET schematic_x = 814, schematic_y = 1072.5, label_x = 794.5, label_y = 1072.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '北門';
--> statement-breakpoint
UPDATE stations SET schematic_x = 989.5, schematic_y = 1293, label_x = 970, label_y = 1302, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '台電大樓';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1183, schematic_y = 822, label_x = 1203, label_y = 800, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '西湖';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1307.5, schematic_y = 822, label_x = 1307.5, label_y = 796.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '內湖';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1198, schematic_y = 1329, label_x = 1178.5, label_y = 1329, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '辛亥';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1141, schematic_y = 822, label_x = 1141, label_y = 796.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '劍南路';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1225, schematic_y = 822, label_x = 1225, label_y = 860, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '港墘';
--> statement-breakpoint
UPDATE stations SET schematic_x = 820, schematic_y = 528, label_x = 841, label_y = 528, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '新北投';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 889.5, label_x = 887, label_y = 867.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '圓山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 530, schematic_y = 390, label_x = 513, label_y = 396, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '淡水';
--> statement-breakpoint
UPDATE stations SET schematic_x = 628, schematic_y = 1543.5, label_x = 607, label_y = 1543.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '土城';
--> statement-breakpoint
UPDATE stations SET schematic_x = 953.5, schematic_y = 933, label_x = 953.5, label_y = 909, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '中山國小';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1094.5, schematic_y = 975, label_x = 1074.5, label_y = 953, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '中山國中';
--> statement-breakpoint
UPDATE stations SET schematic_x = 628, schematic_y = 1492.5, label_x = 607, label_y = 1492.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '海山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1147, schematic_y = 1209, label_x = 1147, label_y = 1247, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '信義安和';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 756, label_x = 887.5, label_y = 756, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '芝山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 801, label_x = 887.5, label_y = 801, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '士林';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1000, schematic_y = 981, label_x = 980.5, label_y = 981, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '行天宮';
--> statement-breakpoint
UPDATE stations SET schematic_x = 820, schematic_y = 598.5, label_x = 799, label_y = 598.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '奇岩';
--> statement-breakpoint
UPDATE stations SET schematic_x = 680.5, schematic_y = 459, label_x = 661, label_y = 459, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '關渡';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 981, label_x = 887.5, label_y = 981, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '雙連';
--> statement-breakpoint
UPDATE stations SET schematic_x = 620.5, schematic_y = 807, label_x = 601, label_y = 807, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '三民高中';
--> statement-breakpoint
UPDATE stations SET schematic_x = 646, schematic_y = 423, label_x = 625, label_y = 423, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '竹圍';
--> statement-breakpoint
UPDATE stations SET schematic_x = 889, schematic_y = 669, label_x = 869.5, label_y = 669, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '石牌';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1094.5, schematic_y = 873, label_x = 1075, label_y = 873, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '大直';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1094.5, schematic_y = 924, label_x = 1114.5, label_y = 930, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '松山機場';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1286.5, schematic_y = 1399.5, label_x = 1286.5, label_y = 1379.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '木柵';
--> statement-breakpoint
UPDATE stations SET schematic_x = 479.5, schematic_y = 1201.5, label_x = 460, label_y = 1201.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '丹鳳';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1387, schematic_y = 1042.5, label_x = 1367.5, label_y = 1042.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '南港展覽館';
--> statement-breakpoint
UPDATE stations SET schematic_x = 955, schematic_y = 1257, label_x = 934, label_y = 1257, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '古亭';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 844.5, label_x = 927, label_y = 850.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '劍潭';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1334.5, schematic_y = 1102.5, label_x = 1334.5, label_y = 1082.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '昆陽';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1249, schematic_y = 1209, label_x = 1269, label_y = 1215, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '象山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 712.5, label_x = 886, label_y = 712.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '明德';
--> statement-breakpoint
UPDATE stations SET schematic_x = 628, schematic_y = 1440, label_x = 607, label_y = 1440, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '亞東醫院';
--> statement-breakpoint
UPDATE stations SET schematic_x = 628, schematic_y = 1596, label_x = 607, label_y = 1596, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '永寧';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 1164, label_x = 887, label_y = 1142, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '台大醫院';
--> statement-breakpoint
UPDATE stations SET schematic_x = 652, schematic_y = 1029, label_x = 631, label_y = 1029, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '三重';
--> statement-breakpoint
UPDATE stations SET schematic_x = 628, schematic_y = 1389, label_x = 607, label_y = 1389, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '府中';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1004.5, schematic_y = 1543.5, label_x = 985, label_y = 1543.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '小碧潭';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1198, schematic_y = 1368, label_x = 1177, label_y = 1368, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '萬芳醫院';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1120, schematic_y = 1296, label_x = 1100.5, label_y = 1306.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '六張犁';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1171, schematic_y = 1296, label_x = 1191, label_y = 1302, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '麟光';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1235.5, schematic_y = 1399.5, label_x = 1215.5, label_y = 1405.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '萬芳社區';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1387, schematic_y = 897, label_x = 1367.5, label_y = 897, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '葫洲';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1048, schematic_y = 1209, label_x = 1048, label_y = 1154, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '大安森林公園';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1198, schematic_y = 1209, label_x = 1198, label_y = 1189, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '台北101/世貿';
--> statement-breakpoint
UPDATE stations SET schematic_x = 649, schematic_y = 1332, label_x = 628, label_y = 1332, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '板橋';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1030, schematic_y = 1332, label_x = 1010.5, label_y = 1332, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '公館';
--> statement-breakpoint
UPDATE stations SET schematic_x = 785.5, schematic_y = 564, label_x = 766, label_y = 564, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '北投';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1000, schematic_y = 1117.5, label_x = 1000, label_y = 1097.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '忠孝新生';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 1117.5, label_x = 907, label_y = 1097.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '台北車站';
--> statement-breakpoint
UPDATE stations SET schematic_x = 587.5, schematic_y = 774, label_x = 568, label_y = 774, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '蘆洲';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 1026, label_x = 887.5, label_y = 1041, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '中山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1094.5, schematic_y = 1026, label_x = 1114.5, label_y = 1004, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '南京復興';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 1209, label_x = 927, label_y = 1187, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '中正紀念堂';
--> statement-breakpoint
UPDATE stations SET schematic_x = 814, schematic_y = 1165.5, label_x = 794.5, label_y = 1165.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '西門';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 933, label_x = 887, label_y = 911, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '民權西路';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1094.5, schematic_y = 1119, label_x = 1094.5, label_y = 1099, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '忠孝復興';
--> statement-breakpoint
UPDATE stations SET schematic_x = 985, schematic_y = 1507.5, label_x = 985, label_y = 1487.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '十四張';
--> statement-breakpoint
UPDATE stations SET schematic_x = 916, schematic_y = 1515, label_x = 916, label_y = 1495, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '秀朗橋';
--> statement-breakpoint
UPDATE stations SET schematic_x = 856, schematic_y = 1522.5, label_x = 876, label_y = 1562.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '景平';
--> statement-breakpoint
UPDATE stations SET schematic_x = 790, schematic_y = 1447.5, label_x = 769, label_y = 1447.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '中和';
--> statement-breakpoint
UPDATE stations SET schematic_x = 745, schematic_y = 1402.5, label_x = 724, label_y = 1402.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '橋和';
--> statement-breakpoint
UPDATE stations SET schematic_x = 700, schematic_y = 1365, label_x = 720, label_y = 1371, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '中原';
--> statement-breakpoint
UPDATE stations SET schematic_x = 677.5, schematic_y = 1357.5, label_x = 677.5, label_y = 1337.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '板新';
--> statement-breakpoint
UPDATE stations SET schematic_x = 652, schematic_y = 1275, label_x = 652, label_y = 1255, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '新埔民生';
--> statement-breakpoint
UPDATE stations SET schematic_x = 580, schematic_y = 1035, label_x = 560, label_y = 1041, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '幸福';
--> statement-breakpoint
UPDATE stations SET schematic_x = 616, schematic_y = 960, label_x = 616, label_y = 940, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '新北產業園區';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1400, schematic_y = 1209, label_x = 1400, label_y = 1189, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '廣慈/奉天宮';
--> statement-breakpoint
UPDATE stations SET schematic_x = 580, schematic_y = 345, label_x = 597, label_y = 351, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '竿蓁林';
--> statement-breakpoint
UPDATE stations SET schematic_x = 545, schematic_y = 310, label_x = 562, label_y = 316, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '淡金鄧公';
--> statement-breakpoint
UPDATE stations SET schematic_x = 510, schematic_y = 275, label_x = 527, label_y = 281, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '淡江大學';
--> statement-breakpoint
UPDATE stations SET schematic_x = 475, schematic_y = 240, label_x = 492, label_y = 246, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '淡金北新';
--> statement-breakpoint
UPDATE stations SET schematic_x = 440, schematic_y = 205, label_x = 457, label_y = 211, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '新市一路';
--> statement-breakpoint
UPDATE stations SET schematic_x = 405, schematic_y = 170, label_x = 422, label_y = 176, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '淡水行政中心';
--> statement-breakpoint
UPDATE stations SET schematic_x = 370, schematic_y = 135, label_x = 387, label_y = 141, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '濱海義山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 300, schematic_y = 135, label_x = 300, label_y = 173, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '濱海沙崙';
--> statement-breakpoint
UPDATE stations SET schematic_x = 300, schematic_y = 85, label_x = 317, label_y = 91, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '淡海新市鎮';
--> statement-breakpoint
UPDATE stations SET schematic_x = 300, schematic_y = 35, label_x = 317, label_y = 41, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '崁頂';
--> statement-breakpoint
UPDATE stations SET schematic_x = 220, schematic_y = 135, label_x = 220, label_y = 115, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '台北海洋大學';
--> statement-breakpoint
UPDATE stations SET schematic_x = 140, schematic_y = 135, label_x = 140, label_y = 112, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '沙崙';
--> statement-breakpoint
UPDATE stations SET schematic_x = 60, schematic_y = 135, label_x = 80, label_y = 175, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '淡水漁人碼頭';
--> statement-breakpoint
UPDATE stations SET schematic_x = 940, schematic_y = 1580, label_x = 960, label_y = 1586, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '新和國小';
--> statement-breakpoint
UPDATE stations SET schematic_x = 905, schematic_y = 1640, label_x = 925, label_y = 1646, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '陽光運動公園';
--> statement-breakpoint
UPDATE stations SET schematic_x = 870, schematic_y = 1700, label_x = 890, label_y = 1706, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '安康';
--> statement-breakpoint
UPDATE stations SET schematic_x = 805, schematic_y = 1765, label_x = 825, label_y = 1771, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '景文科大';
--> statement-breakpoint
UPDATE stations SET schematic_x = 690, schematic_y = 1795, label_x = 690, label_y = 1775, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '耕莘安康院區';
--> statement-breakpoint
UPDATE stations SET schematic_x = 570, schematic_y = 1795, label_x = 570, label_y = 1775, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '台北小城';
--> statement-breakpoint
UPDATE stations SET schematic_x = 455, schematic_y = 1795, label_x = 455, label_y = 1775, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '玫瑰中國城';
--> statement-breakpoint
UPDATE stations SET schematic_x = 340, schematic_y = 1795, label_x = 320, label_y = 1801, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '雙城';
--> statement-breakpoint
UPDATE stations SET schematic_x = 575, schematic_y = 1700, label_x = 595, label_y = 1706, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '媽祖田';
--> statement-breakpoint
UPDATE stations SET schematic_x = 490, schematic_y = 1700, label_x = 490, label_y = 1680, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '長壽山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 405, schematic_y = 1700, label_x = 405, label_y = 1680, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '橫溪';
--> statement-breakpoint
UPDATE stations SET schematic_x = 320, schematic_y = 1700, label_x = 320, label_y = 1680, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '龍埔';
--> statement-breakpoint
UPDATE stations SET schematic_x = 235, schematic_y = 1700, label_x = 235, label_y = 1680, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '三峽';
--> statement-breakpoint
UPDATE stations SET schematic_x = 150, schematic_y = 1700, label_x = 150, label_y = 1680, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '臺北大學';
--> statement-breakpoint
UPDATE stations SET schematic_x = 65, schematic_y = 1640, label_x = 85, label_y = 1646, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '鶯歌車站';
--> statement-breakpoint
UPDATE stations SET schematic_x = 65, schematic_y = 1570, label_x = 85, label_y = 1576, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '陶瓷老街';
--> statement-breakpoint
UPDATE stations SET schematic_x = 65, schematic_y = 1500, label_x = 85, label_y = 1506, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '國華';
--> statement-breakpoint
UPDATE stations SET schematic_x = 65, schematic_y = 1430, label_x = 85, label_y = 1436, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '永吉公園';
--> statement-breakpoint
UPDATE stations SET schematic_x = 65, schematic_y = 1360, label_x = 85, label_y = 1366, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '鶯桃福德';
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1026]},{"command":"L","coordinates":[1094.5,1119]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南京復興') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝復興');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,975]},{"command":"L","coordinates":[1094.5,1026]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中山國中') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南京復興');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,924]},{"command":"L","coordinates":[1094.5,975]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '松山機場') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中山國中');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,873]},{"command":"L","coordinates":[1094.5,924]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大直') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '松山機場');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1141,822]},{"command":"L","coordinates":[1109.5,822]},{"command":"Q","coordinates":[1094.5,822,1094.5,840]},{"command":"L","coordinates":[1094.5,873]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '劍南路') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大直');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1183,822]},{"command":"L","coordinates":[1141,822]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '西湖') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '劍南路');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1225,822]},{"command":"L","coordinates":[1183,822]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '港墘') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '西湖');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1265.5,822]},{"command":"L","coordinates":[1225,822]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '文德') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '港墘');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1307.5,822]},{"command":"L","coordinates":[1265.5,822]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '內湖') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '文德');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1364.5,844.5]},{"command":"Q","coordinates":[1339,814.5,1307.5,822]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大湖公園') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '內湖');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1387,897]},{"command":"Q","coordinates":[1387,870,1364.5,844.5]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '葫洲') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大湖公園');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1387,948]},{"command":"L","coordinates":[1387,897]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '東湖') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '葫洲');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1387,999]},{"command":"L","coordinates":[1387,948]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南港軟體園區') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '東湖');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1119]},{"command":"L","coordinates":[1094.5,1209]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝復興') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大安');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1209]},{"command":"L","coordinates":[1094.5,1257]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大安') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '科技大樓');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1257]},{"command":"L","coordinates":[1094.5,1279.5]},{"command":"Q","coordinates":[1094.5,1296,1120,1296]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '科技大樓') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '六張犁');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1120,1296]},{"command":"L","coordinates":[1171,1296]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '六張犁') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '麟光');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1171,1296]},{"command":"Q","coordinates":[1198,1296,1198,1329]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '麟光') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '辛亥');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1198,1329]},{"command":"L","coordinates":[1198,1368]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '辛亥') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '萬芳醫院');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1198,1368]},{"command":"Q","coordinates":[1198,1399.5,1235.5,1399.5]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '萬芳醫院') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '萬芳社區');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1235.5,1399.5]},{"command":"L","coordinates":[1286.5,1399.5]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '萬芳社區') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '木柵');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1286.5,1399.5]},{"command":"L","coordinates":[1337.5,1399.5]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '木柵') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '動物園');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1387,999]},{"command":"L","coordinates":[1387,1042.5]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南港軟體園區') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南港展覽館');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1387,1050]},{"command":"L","coordinates":[1360,1077]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南港展覽館') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南港');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1360,1077]},{"command":"L","coordinates":[1334.5,1102.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南港') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '昆陽');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1334.5,1102.5]},{"command":"L","coordinates":[1297,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '昆陽') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '後山埤');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1297,1117.5]},{"command":"L","coordinates":[1258,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '後山埤') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '永春');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1258,1117.5]},{"command":"L","coordinates":[1216,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '永春') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '市政府');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1216,1117.5]},{"command":"L","coordinates":[1175.5,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '市政府') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '國父紀念館');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1175.5,1117.5]},{"command":"L","coordinates":[1135,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '國父紀念館') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝敦化');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1135,1117.5]},{"command":"L","coordinates":[1094.5,1119]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝敦化') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝復興');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1119]},{"command":"L","coordinates":[1000,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝復興') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝新生');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1000,1117.5]},{"command":"L","coordinates":[953.5,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝新生') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '善導寺');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[953.5,1117.5]},{"command":"L","coordinates":[907,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '善導寺') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北車站');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,1117.5]},{"command":"Q","coordinates":[839.5,1117.5,814,1165.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北車站') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '西門');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[814,1165.5]},{"command":"L","coordinates":[775,1206]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '西門') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '龍山寺');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[775,1206]},{"command":"L","coordinates":[733,1248]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '龍山寺') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '江子翠');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[733,1248]},{"command":"L","coordinates":[691,1290]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '江子翠') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新埔');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[691,1290]},{"command":"L","coordinates":[649,1332]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新埔') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板橋');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[649,1332]},{"command":"Q","coordinates":[628,1350,628,1389]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板橋') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '府中');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[628,1389]},{"command":"L","coordinates":[628,1440]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '府中') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '亞東醫院');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[628,1440]},{"command":"L","coordinates":[628,1492.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '亞東醫院') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '海山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[628,1492.5]},{"command":"L","coordinates":[628,1543.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '海山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '土城');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[628,1543.5]},{"command":"L","coordinates":[628,1596]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '土城') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '永寧');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[628,1596]},{"command":"L","coordinates":[628,1647]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '永寧') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頂埔');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[785.5,564]},{"command":"L","coordinates":[820,528]}]' WHERE line_code = 'RA' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '北投') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新北投');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[530,390]},{"command":"L","coordinates":[610,390]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡水') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '紅樹林');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[610,390]},{"command":"L","coordinates":[646,423]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '紅樹林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '竹圍');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[646,423]},{"command":"L","coordinates":[680.5,459]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '竹圍') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '關渡');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[680.5,459]},{"command":"L","coordinates":[715,493.5]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '關渡') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠義');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[715,493.5]},{"command":"L","coordinates":[751,528]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠義') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '復興崗');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[751,528]},{"command":"L","coordinates":[785.5,564]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '復興崗') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '北投');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[785.5,564]},{"command":"L","coordinates":[820,598.5]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '北投') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '奇岩');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[820,598.5]},{"command":"L","coordinates":[854.5,633]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '奇岩') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '唭哩岸');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[854.5,633]},{"command":"L","coordinates":[889,669]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '唭哩岸') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '石牌');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[889,669]},{"command":"L","coordinates":[907,712.5]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '石牌') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '明德');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,712.5]},{"command":"L","coordinates":[907,756]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '明德') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '芝山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,756]},{"command":"L","coordinates":[907,801]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '芝山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '士林');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,801]},{"command":"L","coordinates":[907,844.5]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '士林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '劍潭');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,844.5]},{"command":"L","coordinates":[907,889.5]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '劍潭') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '圓山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,889.5]},{"command":"L","coordinates":[907,933]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '圓山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '民權西路');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,933]},{"command":"L","coordinates":[907,981]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '民權西路') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '雙連');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,981]},{"command":"L","coordinates":[907,1026]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '雙連') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,1026]},{"command":"L","coordinates":[907,1117.5]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北車站');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,1117.5]},{"command":"L","coordinates":[907,1164]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北車站') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台大醫院');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,1164]},{"command":"L","coordinates":[907,1209]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台大醫院') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中正紀念堂');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,1209]},{"command":"L","coordinates":[1000,1209]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中正紀念堂') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '東門');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1000,1209]},{"command":"L","coordinates":[1048,1209]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '東門') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大安森林公園');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1048,1209]},{"command":"L","coordinates":[1094.5,1209]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大安森林公園') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大安');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1209]},{"command":"L","coordinates":[1147,1209]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大安') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '信義安和');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1147,1209]},{"command":"L","coordinates":[1198,1209]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '信義安和') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北101/世貿');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1198,1209]},{"command":"L","coordinates":[1249,1209]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北101/世貿') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '象山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[587.5,774]},{"command":"L","coordinates":[620.5,807]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '蘆洲') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三民高中');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[620.5,807]},{"command":"L","coordinates":[653.5,840]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三民高中') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '徐匯中學');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[653.5,840]},{"command":"L","coordinates":[688,873]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '徐匯中學') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三和國中');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[688,873]},{"command":"L","coordinates":[719.5,906]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三和國中') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三重國小');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[719.5,906]},{"command":"Q","coordinates":[739,933,749.5,933]},{"command":"L","coordinates":[817,933]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三重國小') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大橋頭');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[445,1236]},{"command":"L","coordinates":[479.5,1201.5]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '迴龍') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '丹鳳');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[479.5,1201.5]},{"command":"L","coordinates":[514,1167]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '丹鳳') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '輔大');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[514,1167]},{"command":"L","coordinates":[548.5,1132.5]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '輔大') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新莊');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[548.5,1132.5]},{"command":"L","coordinates":[583,1098]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新莊') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頭前庄');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[583,1098]},{"command":"L","coordinates":[616,1063.5]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頭前庄') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '先嗇宮');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[616,1063.5]},{"command":"L","coordinates":[652,1029]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '先嗇宮') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三重');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[652,1029]},{"command":"L","coordinates":[685,996]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三重') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '菜寮');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[685,996]},{"command":"L","coordinates":[719.5,960]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '菜寮') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北橋');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[719.5,960]},{"command":"Q","coordinates":[739,933,749.5,933]},{"command":"L","coordinates":[817,933]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北橋') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大橋頭');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[817,933]},{"command":"L","coordinates":[907,933]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大橋頭') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '民權西路');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,933]},{"command":"L","coordinates":[953.5,933]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '民權西路') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中山國小');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[953.5,933]},{"command":"Q","coordinates":[1000,933,1000,981]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中山國小') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '行天宮');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1000,981]},{"command":"L","coordinates":[1000,1026]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '行天宮') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '松江南京');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1000,1026]},{"command":"L","coordinates":[1000,1117.5]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '松江南京') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝新生');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1000,1117.5]},{"command":"L","coordinates":[1000,1209]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝新生') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '東門');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1000,1209]},{"command":"L","coordinates":[955,1257]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '東門') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '古亭');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[955,1257]},{"command":"L","coordinates":[869.5,1350]},{"command":"Q","coordinates":[856,1369.5,856,1389]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '古亭') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頂溪');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[856,1389]},{"command":"L","coordinates":[856,1440]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頂溪') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '永安市場');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[856,1440]},{"command":"L","coordinates":[856,1492.5]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '永安市場') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景安');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[856,1492.5]},{"command":"L","coordinates":[856,1543.5]}]' WHERE line_code = 'O' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景安') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南勢角');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1292.5,1026]},{"command":"L","coordinates":[1225,1026]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '松山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南京三民');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1225,1026]},{"command":"L","coordinates":[1159,1026]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南京三民') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北小巨蛋');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1159,1026]},{"command":"L","coordinates":[1094.5,1026]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北小巨蛋') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南京復興');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1026]},{"command":"L","coordinates":[1000,1026]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南京復興') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '松江南京');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1000,1026]},{"command":"L","coordinates":[907,1026]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '松江南京') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,1026]},{"command":"L","coordinates":[839.5,1026]},{"command":"Q","coordinates":[814,1026,814,1054.5]},{"command":"L","coordinates":[814,1072.5]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '北門');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[814,1072.5]},{"command":"L","coordinates":[814,1165.5]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '北門') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '西門');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[814,1165.5]},{"command":"Q","coordinates":[814,1209,850,1209]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '西門') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '小南門');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[850,1209]},{"command":"L","coordinates":[907,1209]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '小南門') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中正紀念堂');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,1209]},{"command":"L","coordinates":[955,1257]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中正紀念堂') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '古亭');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[955,1257]},{"command":"L","coordinates":[989.5,1293]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '古亭') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台電大樓');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[989.5,1293]},{"command":"L","coordinates":[1030,1332]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台電大樓') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '公館');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1030,1332]},{"command":"Q","coordinates":[1054,1359,1054,1389]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '公館') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '萬隆');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1054,1389]},{"command":"L","coordinates":[1054,1440]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '萬隆') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景美');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1054,1440]},{"command":"L","coordinates":[1054,1492.5]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景美') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大坪林');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1054,1492.5]},{"command":"L","coordinates":[1054,1543.5]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大坪林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '七張');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1054,1543.5]},{"command":"L","coordinates":[1054,1594.5]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '七張') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新店區公所');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1054,1594.5]},{"command":"L","coordinates":[1054,1647]}]' WHERE line_code = 'G' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新店區公所') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新店');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1054,1543.5]},{"command":"L","coordinates":[1004.5,1543.5]}]' WHERE line_code = 'GA' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '七張') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '小碧潭');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1054,1492.5]},{"command":"L","coordinates":[985,1507.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大坪林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '十四張');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[985,1507.5]},{"command":"L","coordinates":[916,1515]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '十四張') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '秀朗橋');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[916,1515]},{"command":"L","coordinates":[856,1522.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '秀朗橋') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景平');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[856,1522.5]},{"command":"L","coordinates":[856,1492.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景平') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景安');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[856,1492.5]},{"command":"L","coordinates":[790,1447.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景安') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中和');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[790,1447.5]},{"command":"L","coordinates":[745,1402.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中和') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '橋和');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[745,1402.5]},{"command":"L","coordinates":[700,1365]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '橋和') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中原');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[700,1365]},{"command":"L","coordinates":[677.5,1357.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中原') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板新');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[677.5,1357.5]},{"command":"L","coordinates":[649,1332]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板新') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板橋');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[649,1332]},{"command":"L","coordinates":[652,1275]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板橋') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新埔民生');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[652,1275]},{"command":"Q","coordinates":[640,1155,583,1098]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新埔民生') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頭前庄');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[583,1098]},{"command":"L","coordinates":[580,1035]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頭前庄') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '幸福');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[580,1035]},{"command":"Q","coordinates":[587.5,975,616,960]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '幸福') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新北產業園區');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1249,1209]},{"command":"L","coordinates":[1400,1209]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '象山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '廣慈/奉天宮');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[610,390]},{"command":"L","coordinates":[580,345]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '紅樹林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '竿蓁林');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[580,345]},{"command":"L","coordinates":[545,310]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '竿蓁林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡金鄧公');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[545,310]},{"command":"L","coordinates":[510,275]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡金鄧公') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡江大學');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[510,275]},{"command":"L","coordinates":[475,240]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡江大學') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡金北新');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[475,240]},{"command":"L","coordinates":[440,205]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡金北新') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新市一路');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[440,205]},{"command":"L","coordinates":[405,170]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新市一路') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡水行政中心');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[405,170]},{"command":"L","coordinates":[370,135]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡水行政中心') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '濱海義山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[370,135]},{"command":"L","coordinates":[300,135]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '濱海義山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '濱海沙崙');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[300,135]},{"command":"L","coordinates":[300,85]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '濱海沙崙') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡海新市鎮');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[300,85]},{"command":"L","coordinates":[300,35]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡海新市鎮') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '崁頂');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[300,135]},{"command":"L","coordinates":[220,135]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '濱海沙崙') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北海洋大學');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[220,135]},{"command":"L","coordinates":[140,135]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北海洋大學') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '沙崙');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[140,135]},{"command":"L","coordinates":[60,135]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '沙崙') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡水漁人碼頭');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[985,1507.5]},{"command":"L","coordinates":[940,1580]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '十四張') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新和國小');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[940,1580]},{"command":"L","coordinates":[905,1640]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新和國小') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '陽光運動公園');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[905,1640]},{"command":"L","coordinates":[870,1700]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '陽光運動公園') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '安康');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[870,1700]},{"command":"L","coordinates":[805,1765]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '安康') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景文科大');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[805,1765]},{"command":"L","coordinates":[690,1795]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景文科大') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '耕莘安康院區');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[690,1795]},{"command":"L","coordinates":[570,1795]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '耕莘安康院區') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北小城');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[570,1795]},{"command":"L","coordinates":[455,1795]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '台北小城') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '玫瑰中國城');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[455,1795]},{"command":"L","coordinates":[340,1795]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '玫瑰中國城') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '雙城');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[628,1647]},{"command":"L","coordinates":[575,1700]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頂埔') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '媽祖田');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[575,1700]},{"command":"L","coordinates":[490,1700]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '媽祖田') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '長壽山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[490,1700]},{"command":"L","coordinates":[405,1700]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '長壽山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '橫溪');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[405,1700]},{"command":"L","coordinates":[320,1700]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '橫溪') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '龍埔');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[320,1700]},{"command":"L","coordinates":[235,1700]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '龍埔') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三峽');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[235,1700]},{"command":"L","coordinates":[150,1700]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '三峽') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '臺北大學');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[150,1700]},{"command":"L","coordinates":[65,1640]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '臺北大學') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '鶯歌車站');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[65,1640]},{"command":"L","coordinates":[65,1570]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '鶯歌車站') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '陶瓷老街');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[65,1570]},{"command":"L","coordinates":[65,1500]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '陶瓷老街') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '國華');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[65,1500]},{"command":"L","coordinates":[65,1430]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '國華') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '永吉公園');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[65,1430]},{"command":"L","coordinates":[65,1360]}]' WHERE line_code = 'LB' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '永吉公園') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '鶯桃福德');
--> statement-breakpoint
UPDATE canvas_config SET width = 1600, height = 1880 WHERE id = 1;
