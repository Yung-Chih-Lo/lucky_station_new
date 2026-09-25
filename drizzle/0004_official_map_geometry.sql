-- Reflow the northern Red Line and crowded city interchanges after the official map.
-- Geometry only: preserve station IDs, names, line membership and user data.
UPDATE stations SET schematic_x = 1135, schematic_y = 1117.5, label_x = 1155, label_y = 1156.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '忠孝敦化';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1337.5, schematic_y = 1399.5, label_x = 1339.5, label_y = 1379.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '動物園';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1175.5, schematic_y = 1117.5, label_x = 1195.5, label_y = 1096.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '國父紀念館';
--> statement-breakpoint
UPDATE stations SET schematic_x = 590, schematic_y = 390, label_x = 610, label_y = 396, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '紅樹林';
--> statement-breakpoint
UPDATE stations SET schematic_x = 865, schematic_y = 590, label_x = 845, label_y = 596, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '唭哩岸';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1216, schematic_y = 1117.5, label_x = 1236, label_y = 1156.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '市政府';
--> statement-breakpoint
UPDATE stations SET schematic_x = 953.5, schematic_y = 1117.5, label_x = 953.5, label_y = 1154.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '善導寺';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1292.5, schematic_y = 1026, label_x = 1313, label_y = 1032, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '松山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 655, schematic_y = 510, label_x = 655, label_y = 486, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '忠義';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1297, schematic_y = 1117.5, label_x = 1317, label_y = 1156.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '後山埤';
--> statement-breakpoint
UPDATE stations SET schematic_x = 817, schematic_y = 933, label_x = 816, label_y = 971, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '大橋頭';
--> statement-breakpoint
UPDATE stations SET schematic_x = 720, schematic_y = 510, label_x = 720, label_y = 548, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '復興崗';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1364.5, schematic_y = 844.5, label_x = 1367.5, label_y = 824.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '大湖公園';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1265.5, schematic_y = 822, label_x = 1258.5, label_y = 796.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '文德';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1183, schematic_y = 822, label_x = 1196, label_y = 800, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '西湖';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1307.5, schematic_y = 822, label_x = 1303.5, label_y = 796.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '內湖';
--> statement-breakpoint
UPDATE stations SET schematic_x = 785, schematic_y = 440, label_x = 805, label_y = 446, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '新北投';
--> statement-breakpoint
UPDATE stations SET schematic_x = 590, schematic_y = 300, label_x = 610, label_y = 276, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '淡水';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 745, label_x = 887, label_y = 751, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '芝山';
--> statement-breakpoint
UPDATE stations SET schematic_x = 825, schematic_y = 550, label_x = 805, label_y = 556, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '奇岩';
--> statement-breakpoint
UPDATE stations SET schematic_x = 590, schematic_y = 510, label_x = 570, label_y = 516, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '關渡';
--> statement-breakpoint
UPDATE stations SET schematic_x = 590, schematic_y = 450, label_x = 570, label_y = 456, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '竹圍';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 632, label_x = 887, label_y = 638, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '石牌';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1387, schematic_y = 1042.5, label_x = 1407, label_y = 1048.5, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '南港展覽館';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 690, label_x = 887, label_y = 696, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '明德';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1004.5, schematic_y = 1543.5, label_x = 985, label_y = 1545.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '小碧潭';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1030, schematic_y = 1332, label_x = 1015, label_y = 1332, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '公館';
--> statement-breakpoint
UPDATE stations SET schematic_x = 785, schematic_y = 510, label_x = 785, label_y = 486, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '北投';
--> statement-breakpoint
UPDATE stations SET schematic_x = 907, schematic_y = 1209, label_x = 922, label_y = 1187, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '中正紀念堂';
--> statement-breakpoint
UPDATE stations SET schematic_x = 814, schematic_y = 1165.5, label_x = 800.5, label_y = 1165.5, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '西門';
--> statement-breakpoint
UPDATE stations SET schematic_x = 1094.5, schematic_y = 1117.5, label_x = 1094.5, label_y = 1097.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '忠孝復興';
--> statement-breakpoint
UPDATE stations SET schematic_x = 985, schematic_y = 1492.5, label_x = 985, label_y = 1472.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '十四張';
--> statement-breakpoint
UPDATE stations SET schematic_x = 950, schematic_y = 1492.5, label_x = 950, label_y = 1513, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '秀朗橋';
--> statement-breakpoint
UPDATE stations SET schematic_x = 900, schematic_y = 1492.5, label_x = 900, label_y = 1478.5, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '景平';
--> statement-breakpoint
UPDATE stations SET schematic_x = 810, schematic_y = 1452, label_x = 830, label_y = 1458, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '中和';
--> statement-breakpoint
UPDATE stations SET schematic_x = 770, schematic_y = 1412, label_x = 790, label_y = 1421, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '橋和';
--> statement-breakpoint
UPDATE stations SET schematic_x = 730, schematic_y = 1372, label_x = 750, label_y = 1378, label_anchor = 'start' WHERE transport_type = 'mrt' AND name_zh = '中原';
--> statement-breakpoint
UPDATE stations SET schematic_x = 690, schematic_y = 1332, label_x = 685, label_y = 1308, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '板新';
--> statement-breakpoint
UPDATE stations SET schematic_x = 649, schematic_y = 1275, label_x = 649, label_y = 1255, label_anchor = 'middle' WHERE transport_type = 'mrt' AND name_zh = '新埔民生';
--> statement-breakpoint
UPDATE stations SET schematic_x = 545, schematic_y = 345, label_x = 525, label_y = 351, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '竿蓁林';
--> statement-breakpoint
UPDATE stations SET schematic_x = 545, schematic_y = 310, label_x = 525, label_y = 316, label_anchor = 'end' WHERE transport_type = 'mrt' AND name_zh = '淡金鄧公';
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1026]},{"command":"L","coordinates":[1094.5,1117.5]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南京復興') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝復興');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1117.5]},{"command":"L","coordinates":[1094.5,1209]}]' WHERE line_code = 'BR' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝復興') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大安');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1387,1042.5]},{"command":"L","coordinates":[1360,1077]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南港展覽館') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '南港');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1135,1117.5]},{"command":"L","coordinates":[1094.5,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝敦化') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝復興');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1094.5,1117.5]},{"command":"L","coordinates":[1000,1117.5]}]' WHERE line_code = 'BL' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝復興') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠孝新生');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[785,510]},{"command":"L","coordinates":[785,440]}]' WHERE line_code = 'RA' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '北投') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新北投');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[590,300]},{"command":"L","coordinates":[590,390]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡水') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '紅樹林');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[590,390]},{"command":"L","coordinates":[590,450]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '紅樹林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '竹圍');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[590,450]},{"command":"L","coordinates":[590,510]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '竹圍') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '關渡');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[590,510]},{"command":"L","coordinates":[655,510]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '關渡') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠義');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[655,510]},{"command":"L","coordinates":[720,510]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '忠義') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '復興崗');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[720,510]},{"command":"L","coordinates":[785,510]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '復興崗') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '北投');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[785,510]},{"command":"L","coordinates":[825,550]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '北投') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '奇岩');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[825,550]},{"command":"L","coordinates":[865,590]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '奇岩') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '唭哩岸');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[865,590]},{"command":"L","coordinates":[907,632]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '唭哩岸') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '石牌');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,632]},{"command":"L","coordinates":[907,690]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '石牌') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '明德');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,690]},{"command":"L","coordinates":[907,745]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '明德') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '芝山');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[907,745]},{"command":"L","coordinates":[907,801]}]' WHERE line_code = 'R' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '芝山') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '士林');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[1054,1492.5]},{"command":"L","coordinates":[985,1492.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '大坪林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '十四張');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[985,1492.5]},{"command":"L","coordinates":[950,1492.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '十四張') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '秀朗橋');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[950,1492.5]},{"command":"L","coordinates":[900,1492.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '秀朗橋') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景平');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[900,1492.5]},{"command":"L","coordinates":[856,1492.5]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景平') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景安');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[856,1492.5]},{"command":"L","coordinates":[810,1452]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '景安') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中和');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[810,1452]},{"command":"L","coordinates":[770,1412]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中和') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '橋和');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[770,1412]},{"command":"L","coordinates":[730,1372]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '橋和') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中原');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[730,1372]},{"command":"L","coordinates":[690,1332]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '中原') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板新');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[690,1332]},{"command":"L","coordinates":[649,1332]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板新') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板橋');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[649,1332]},{"command":"L","coordinates":[649,1275]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '板橋') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新埔民生');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[649,1275]},{"command":"Q","coordinates":[640,1155,583,1098]}]' WHERE line_code = 'Y' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新埔民生') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '頭前庄');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[590,390]},{"command":"L","coordinates":[545,345]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '紅樹林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '竿蓁林');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[545,345]},{"command":"L","coordinates":[545,310]}]' WHERE line_code = 'V' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '竿蓁林') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '淡金鄧公');
--> statement-breakpoint
UPDATE connections SET path_json = '[{"command":"M","coordinates":[985,1492.5]},{"command":"L","coordinates":[940,1580]}]' WHERE line_code = 'K' AND from_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '十四張') AND to_station_id IN (SELECT id FROM stations WHERE transport_type = 'mrt' AND name_zh = '新和國小');
