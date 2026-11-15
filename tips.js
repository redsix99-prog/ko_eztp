// 장소별 현지인 팁: 지하철 이동 / 추천 코스 / 추천 카페. (ko·en·ja·zh)
// 카페 이름은 간판에서 찾기 쉽도록 한글을 함께 적습니다. 영업 여부는 구글지도에서 확인하세요.
(function(){
const TIPS={};
// T(id, 지도검색어, 카페이름, ko[지하철,코스,카페설명], en[...], ja[...], zh[...])
const T=(id,q,cafe,ko,en,ja,zh)=>{TIPS[id]={q,cafe,ko,en,ja,zh};};

/* ===== 세련된 서울 ===== */
T('tower','해방촌 카페 서울','해방촌·경리단길 카페 골목',
 ['4호선 명동역 3번 출구에서 케이블카 승강장까지 걸어서 약 15분(오르막). 편하게 가려면 남산 순환버스를 이용하세요.','명동에서 점심 → 남산케이블카 → 정상 전망대 → 일몰 후 야경 → 내려올 때는 순환버스.','남산 아래 해방촌 골목에는 전망 좋은 작은 카페가 많아, 내려온 뒤 쉬어 가기 좋습니다.'],
 ['From Myeong-dong Stn (Line 4), Exit 3, it is about a 15-minute uphill walk to the cable car. The Namsan shuttle bus is easier.','Lunch in Myeong-dong → cable car → summit observatory → night view after sunset → shuttle bus down.','The Haebangchon alleys below Namsan have small cafes with views, ideal for a rest after your visit.'],
 ['4号線 明洞駅3番出口からケーブルカー乗り場まで徒歩約15分（上り坂）。楽に行くなら南山循環バスが便利です。','明洞でランチ → 南山ケーブルカー → 山頂展望台 → 日没後の夜景 → 帰りは循環バス。','南山のふもとの海放村（ヘバンチョン）には眺めのよい小さなカフェが多く、下山後の休憩に向いています。'],
 ['从4号线明洞站3号口步行约15分钟（上坡）可到缆车站，想省力可乘南山循环巴士。','明洞午餐 → 南山缆车 → 山顶观景台 → 日落后看夜景 → 下山乘循环巴士。','南山脚下的海方村（Haebangchon）小巷里有不少景观不错的小咖啡馆，适合下山后休息。']);

T('lotte','송리단길 카페 서울','송리단길 카페 골목(석촌호수 인근)',
 ['2·8호선 잠실역에서 지하로 롯데월드몰과 바로 연결됩니다. 서울스카이는 롯데월드타워 입구에서 입장합니다.','롯데월드몰 구경 → 서울스카이 전망 → 석촌호수 산책 → 저녁은 송리단길.','석촌호수 동쪽 송리단길(8호선 석촌역 일대)에 현지인이 즐겨 찾는 개성 있는 카페가 모여 있습니다.'],
 ['Jamsil Stn (Lines 2 and 8) connects underground to Lotte World Mall. Enter Seoul Sky at the tower entrance.','Lotte World Mall → Seoul Sky view → stroll around Seokchon Lake → dinner in Songridan-gil.','Songridan-gil (around Seokchon Stn, Line 8) is lined with independent cafes that locals like.'],
 ['2・8号線 蚕室駅から地下でロッテワールドモールに直結しています。ソウルスカイはロッテワールドタワーの入口から入場します。','ロッテワールドモール → ソウルスカイの展望 → 石村湖の散策 → 夕食は松里団通り（ソンリダンギル）。','石村湖の東側、松里団通り（8号線 石村駅周辺）に地元の人が通う個性的なカフェが集まっています。'],
 ['2、8号线蚕室站有地下通道直通乐天世界购物中心，首尔天空在乐天世界塔入口入场。','乐天世界购物中心 → 首尔天空观景 → 石村湖散步 → 晚餐去松里团路。','石村湖东侧的松里团路（8号线石村站一带）聚集着当地人常去的特色咖啡馆。']);

T('banpo','서래마을 카페 서울','서래마을 카페 거리',
 ['3·7·9호선 고속터미널역 8-1번 출구 쪽으로 나가 한강공원 방향으로 걸어서 약 10~15분.','고속터미널역 → 반포한강공원에서 해 질 녘 산책 → 달빛무지개분수 → 서래마을에서 저녁.','서래마을(고속터미널역 인근)은 조용한 카페와 베이커리가 많은 동네입니다. 분수는 계절별 운영 시간을 확인하세요.'],
 ['Take Express Bus Terminal Stn (Lines 3, 7, 9) toward Exit 8-1, then walk 10–15 minutes toward Banpo Hangang Park.','Express Bus Terminal Stn → sunset walk in Banpo Hangang Park → Moonlight Rainbow Fountain → dinner in Seorae Village.','Seorae Village near the station has quiet cafes and bakeries. Check the fountain schedule for the season.'],
 ['3・7・9号線 高速ターミナル駅の8-1番出口方面から、漢江公園まで徒歩約10〜15分。','高速ターミナル駅 → 盤浦漢江公園で夕暮れの散歩 → 月光レインボー噴水 → 西来村（ソレマウル）で夕食。','西来村（高速ターミナル駅の近く）は静かなカフェやベーカリーが多い街です。噴水の運営時間は季節ごとに確認してください。'],
 ['乘3、7、9号线高速巴士客运站，从8-1号出口方向步行约10~15分钟可到盘浦汉江公园。','高速巴士客运站 → 盘浦汉江公园黄昏散步 → 月光彩虹喷泉 → 在西来村吃晚餐。','车站附近的西来村有不少安静的咖啡馆和面包店。喷泉的运行时间请按季节确认。']);

T('ttukseom','어니언 성수 서울','어니언 성수 (Onion Seongsu)',
 ['7호선 뚝섬유원지역에서 한강공원까지 걸어서 약 5분. 2호선 뚝섬역·성수역에서는 걸어서 15~20분 걸립니다.','성수동 카페·편집숍 구경 → 서울숲 산책 → 뚝섬한강공원에서 일몰과 한강 라면.','성수동의 오래된 공장을 고친 베이커리 카페로, 현지인에게 꾸준히 인기가 많습니다. 주말에는 오전에 가세요.'],
 ['From Ttukseom Resort Stn (Line 7) it is about a 5-minute walk to the park. From Ttukseom or Seongsu Stn (Line 2) allow 15–20 minutes.','Seongsu cafes and shops → Seoul Forest walk → sunset and Han River ramyeon at Ttukseom.','A bakery cafe in a converted old Seongsu factory, steadily popular with locals. Go in the morning on weekends.'],
 ['7号線 纛島遊園地駅から漢江公園まで徒歩約5分。2号線の纛島駅・聖水駅からは徒歩15〜20分です。','聖水洞のカフェ・セレクトショップ巡り → ソウルの森を散策 → 纛島漢江公園で夕日と漢江ラーメン。','聖水洞の古い工場を改装したベーカリーカフェで、地元の人にも人気です。週末は午前中がおすすめです。'],
 ['乘7号线纛岛游园地站，步行约5分钟可到汉江公园；从2号线纛岛站、圣水站步行需15~20分钟。','圣水洞咖啡馆和买手店 → 首尔林散步 → 纛岛汉江公园看日落、吃汉江拉面。','由圣水洞老工厂改造的烘焙咖啡馆，一直很受当地人欢迎，周末建议早上去。']);

T('naksan','학림다방 서울','학림다방 (Hakrim Dabang)',
 ['4호선 혜화역 2번 출구에서 이화마을을 지나 낙산공원까지 걸어서 약 15~20분(오르막).','혜화 대학로 → 이화마을 벽화 골목 → 낙산공원 성곽길 → 야경 → 성곽을 따라 동대문 쪽으로 내려가 1·4호선 동대문역에서 귀가.','1956년부터 영업해 온 혜화의 오래된 다방입니다. 클래식 음악과 진한 커피로 현지인과 예술가들이 즐겨 찾습니다.'],
 ['From Hyehwa Stn (Line 4), Exit 2, walk 15–20 minutes uphill via Ihwa Village to Naksan Park.','Hyehwa and Daehangno → Ihwa mural alleys → Naksan fortress wall → night view → walk down toward Dongdaemun and take Line 1 or 4.','A classic cafe in Hyehwa open since 1956, loved by locals and artists for its classical music and strong coffee.'],
 ['4号線 恵化駅2番出口から梨花村を通って洛山公園まで徒歩約15〜20分（上り坂）。','恵化・大学路 → 梨花村の壁画通り → 洛山公園の城郭道 → 夜景 → 城郭沿いに東大門方面へ下りて1・4号線で帰ります。','1956年から続く恵化の老舗の喫茶店です。クラシック音楽と濃いコーヒーで、地元の人や芸術家に愛されています。'],
 ['从4号线惠化站2号口出发，经梨花村步行约15~20分钟（上坡）到达骆山公园。','惠化大学路 → 梨花村壁画小巷 → 骆山公园城郭步道 → 夜景 → 沿城郭下到东大门，乘1、4号线回程。','1956年开业的惠化老牌咖啡馆，古典乐和浓咖啡深受当地人和艺术家喜爱。']);

/* ===== K-팝·K-뷰티 ===== */
T('myeongdong','명동 카페 서울','명동성당 주변 골목 카페',
 ['4호선 명동역 6번 출구가 가장 가깝습니다. 2호선 을지로입구역 5·6번 출구에서도 걸어올 수 있습니다.','올리브영·화장품 매장 쇼핑 → 명동성당 → 저녁 길거리 음식. 4호선으로 두 정거장이면 동대문역사문화공원역(DDP)입니다.','큰길은 붐비니 명동성당 뒤편 골목으로 들어가면 조용한 카페가 있습니다. 화장품은 여권을 가져가면 현장 면세 혜택을 받을 수 있는 곳이 많습니다.'],
 ['Myeong-dong Stn (Line 4), Exit 6 is closest. You can also walk from Euljiro 1-ga Stn (Line 2), Exits 5 and 6.','Beauty shops → Myeongdong Cathedral → street food at night. Two stops on Line 4 reach Dongdaemun History & Culture Park (DDP).','The main street is crowded, so try the quiet cafes on the alleys behind the cathedral. Bring your passport; many shops offer tax-free shopping.'],
 ['4号線 明洞駅6番出口が最寄りです。2号線 乙支路入口駅5・6番出口からも歩けます。','コスメ店巡り → 明洞聖堂 → 夜は屋台グルメ。4号線で2駅先が東大門歴史文化公園駅（DDP）です。','大通りは混むので、明洞聖堂の裏通りに入ると静かなカフェがあります。パスポートを持参すると免税で買える店が多いです。'],
 ['最近的是4号线明洞站6号口；从2号线乙支路入口站5、6号口也可步行前往。','逛美妆店 → 明洞圣堂 → 夜晚吃街边小吃。乘4号线两站即到东大门历史文化公园站（DDP）。','主街人多，可去明洞圣堂后面的小巷找安静的咖啡馆。带上护照，很多店可以免税购物。']);

T('hongdae','앤트러사이트 합정 서울','앤트러사이트 합정 (Anthracite Hapjeong)',
 ['2호선 홍대입구역 9번 출구로 나오면 ‘홍대 걷고 싶은 거리’입니다. 인천공항에서 공항철도로 약 50분 만에 닿습니다.','연남동 경의선숲길 산책 → 홍대 걷고 싶은 거리 버스킹 → 2호선으로 한 정거장 합정에서 카페 → 저녁 망원시장.','옛 신발 공장을 고쳐 만든 합정의 로스터리 카페로, 현지인이 즐겨 찾는 분위기 있는 곳입니다.'],
 ['Exit 9 of Hongik Univ. Stn (Line 2) leads to the Hongdae Walking Street. The AREX airport railroad takes about 50 minutes from Incheon Airport.','Yeonnam-dong Gyeongui Line Forest Park → Hongdae busking street → one stop on Line 2 to Hapjeong for a cafe → dinner at Mangwon Market.','A roastery cafe in a former shoe factory in Hapjeong, with an atmosphere locals enjoy.'],
 ['2号線 弘大入口駅9番出口を出ると「弘大歩きたい通り」です。仁川空港から空港鉄道で約50分です。','延南洞の京義線の森道を散歩 → 弘大のバスキング通り → 2号線で1駅の合井でカフェ → 夕食は望遠市場。','かつての靴工場を改装した合井のロースタリーカフェで、地元の人に人気の雰囲気のよい店です。'],
 ['从2号线弘大入口站9号口出来就是“弘大步行街”。从仁川机场乘机场快线约50分钟可到。','延南洞京义线林荫道散步 → 弘大街头表演 → 乘2号线一站到合井喝咖啡 → 晚餐去望远市场。','合井的烘焙咖啡馆，由旧鞋厂改造，氛围很受当地人喜爱。']);

T('seongsu','대림창고 성수 서울','대림창고 갤러리 카페 (Daelim Changgo)',
 ['2호선 성수역 3번 출구가 카페거리와 가깝고, 뚝섬역 8번 출구도 편합니다. 두 역은 한 정거장 거리입니다.','성수역 → 연무장길 편집숍·팝업 → 대림창고 카페 → 서울숲(수인분당선 서울숲역 방향)에서 마무리.','오래된 창고를 개조한 넓은 갤러리형 카페로, 성수동 분위기를 대표하는 곳입니다. 주말 오후는 붐빕니다.'],
 ['Exit 3 of Seongsu Stn (Line 2) is close to the cafe streets; Exit 8 of Ttukseom Stn is also handy. The two stations are one stop apart.','Seongsu Stn → boutiques and pop-ups on Yeonmujang-gil → Daelim Changgo cafe → finish at Seoul Forest.','A spacious gallery-style cafe in an old warehouse that represents Seongsu well. Weekend afternoons are crowded.'],
 ['2号線 聖水駅3番出口がカフェ通りに近く、纛島駅8番出口も便利です。2駅は1駅しか離れていません。','聖水駅 → 練武場通りのセレクトショップやポップアップ → 大林倉庫カフェ → ソウルの森で締めくくり。','古い倉庫を改装した広いギャラリー型カフェで、聖水洞らしさを代表する店です。週末の午後は混みます。'],
 ['2号线圣水站3号口离咖啡街很近，纛岛站8号口也方便，两站相隔一站。','圣水站 → 练武场路买手店和快闪店 → 大林仓库咖啡馆 → 首尔林收尾。','由旧仓库改造的宽敞画廊式咖啡馆，是圣水洞氛围的代表，周末下午人很多。']);

T('ddp','광희동 카페 서울','동대문 광희동 골목 카페',
 ['2·4·5호선 동대문역사문화공원역 1번 출구가 DDP 바로 앞입니다.','DDP 외관과 전시 → 동대문 패션몰 구경 → 밤에 조명 켜진 DDP → 4호선으로 명동까지 두 정거장.','DDP 맞은편 광희동·장충동 골목에 작은 카페가 있습니다. 동대문 패션몰은 밤 늦게까지, 일부 도매 상가는 새벽에 문을 엽니다.'],
 ['Exit 1 of Dongdaemun History & Culture Park Stn (Lines 2, 4, 5) is right in front of DDP.','DDP exterior and exhibition → Dongdaemun fashion malls → DDP lit up at night → two stops on Line 4 to Myeong-dong.','Small cafes sit in the Gwanghui-dong alleys across from DDP. The fashion malls stay open late and some wholesale markets open in the early hours.'],
 ['2・4・5号線 東大門歴史文化公園駅1番出口がDDPの目の前です。','DDPの外観と展示 → 東大門ファッションモール → 夜にライトアップされたDDP → 4号線で2駅先の明洞へ。','DDPの向かいの光熙洞の路地に小さなカフェがあります。ファッションモールは夜遅くまで、一部の卸売市場は未明に営業します。'],
 ['2、4、5号线东大门历史文化公园站1号口就在DDP前面。','DDP外观和展览 → 东大门时装商城 → 夜晚亮灯的DDP → 乘4号线两站到明洞。','DDP对面的光熙洞小巷里有小咖啡馆。时装商城营业到很晚，部分批发市场凌晨营业。']);

T('coex','선정릉 카페 서울','선정릉 주변 카페',
 ['2호선 삼성역 5·6번 출구에서 코엑스몰로 바로 이어지고, 9호선 봉은사역에서도 가깝습니다.','코엑스몰·별마당도서관 → 길 건너 봉은사(도보 약 10분) → 선정릉 숲길 산책.','선릉·삼성 일대에는 직장인이 즐겨 찾는 카페가 많습니다. 조용히 쉬려면 선정릉 옆 골목을 추천합니다.'],
 ['Samseong Stn (Line 2), Exits 5 and 6 lead straight into COEX Mall. Bongeunsa Stn (Line 9) is also close.','COEX Mall and Starfield Library → Bongeunsa Temple across the road (about 10 minutes) → walk in Seonjeongneung park.','The Seolleung and Samseong area has plenty of cafes popular with office workers. For quiet, try the alleys beside Seonjeongneung.'],
 ['2号線 三成駅5・6番出口からCOEXモールに直結しており、9号線 奉恩寺駅からも近いです。','COEXモールと星空図書館 → 道を渡って奉恩寺（徒歩約10分） → 宣靖陵の森を散策。','宣陵・三成周辺には会社員がよく使うカフェが多くあります。静かに過ごすなら宣靖陵の横の路地がおすすめです。'],
 ['从2号线三成站5、6号口可直接进入COEX购物中心，9号线奉恩寺站也很近。','COEX商城和星空图书馆 → 过马路到奉恩寺（步行约10分钟） → 在宣靖陵林间散步。','宣陵、三成一带有很多上班族常去的咖啡馆，想安静些可去宣靖陵旁的小巷。']);

/* ===== 서울 근교 자연 ===== */
T('bukhansan','우이동 카페 서울','우이동 계곡 카페·식당가',
 ['우이신설선 북한산우이역에서 우이동 탐방지원센터까지 걸어서 약 10~15분. 백운대 정상은 왕복 약 5~6시간을 잡으세요.','처음이라면 둘레길 쉬운 구간만 걷고, 체력이 되면 백운대로. 하산 후 우이동에서 식사하고 우이신설선으로 귀가.','하산한 뒤 우이동 입구에 전망 좋은 카페와 식당이 모여 있습니다. 등산화와 물, 해지기 전 하산 일정을 꼭 챙기세요.'],
 ['From Bukhansanuii Stn (Ui-Sinseol Line) it is a 10–15 minute walk to the Ui-dong ranger station. Allow about 5–6 hours round trip for Baegundae.','Beginners can walk an easy dulle-gil section; fit hikers can continue to Baegundae. Eat in Ui-dong afterwards and return on the Ui-Sinseol Line.','Cafes and restaurants cluster at the Ui-dong entrance for after the hike. Bring hiking shoes, water, and finish before sunset.'],
 ['牛耳新設線 北漢山牛耳駅から牛耳洞の探訪支援センターまで徒歩約10〜15分。白雲台の山頂は往復5〜6時間を見てください。','初めてなら楽なコースの散策路だけを歩き、体力があれば白雲台へ。下山後は牛耳洞で食事をして牛耳新設線で帰ります。','下山後は牛耳洞の入口に眺めのよいカフェや食堂が集まっています。登山靴と水、日没前に下山する計画をお忘れなく。'],
 ['从牛耳新设线北汉山牛耳站步行约10~15分钟可到牛耳洞探访支援中心，登白云台往返约需5~6小时。','新手可只走较轻松的环山路段，体力好再上白云台；下山后在牛耳洞用餐，乘牛耳新设线回程。','下山后牛耳洞入口处聚集着景观不错的咖啡馆和餐厅。请带好登山鞋和水，并在日落前下山。']);

T('dobong','서울창포원 서울','서울창포원 (Seoul Iris Garden)',
 ['1·7호선 도봉산역에서 등산로 입구까지 걸어서 약 15~20분이며, 가는 길에 등산용품점과 식당이 이어집니다.','서울창포원 산책 → 도봉산 입구 → 마당바위·포대능선 중 체력에 맞는 코스 → 하산 후 파전과 막걸리.','도봉산역 바로 옆 대형 정원으로, 계절별 꽃을 보며 산행 전후에 가볍게 걷기 좋습니다. 암릉 구간은 비 오는 날을 피하세요.'],
 ['From Dobongsan Stn (Lines 1 and 7) it is a 15–20 minute walk to the trailhead, passing hiking shops and restaurants.','Seoul Iris Garden → trailhead → choose a route to suit your fitness → pajeon and makgeolli after the hike.','A large garden beside the station, nice for an easy walk before or after hiking. Avoid the rocky sections on rainy days.'],
 ['1・7号線 道峰山駅から登山口まで徒歩約15〜20分で、道沿いに登山用品店や食堂が並んでいます。','ソウル菖蒲園を散策 → 道峰山の登山口 → 体力に合わせてコースを選択 → 下山後はパジョンとマッコリ。','道峰山駅のすぐ隣にある大きな庭園で、季節の花を見ながら登山の前後に軽く歩けます。岩場は雨の日を避けてください。'],
 ['从1、7号线道峰山站步行约15~20分钟到登山口，沿途有登山用品店和餐馆。','首尔菖蒲园散步 → 道峰山入口 → 按体力选择路线 → 下山后吃海鲜煎饼配马格利。','道峰山站旁的大型花园，登山前后可轻松散步赏花。岩石路段请避开雨天。']);

T('namhan','남한산성 카페 광주','남한산성 행궁 인근 전통찻집',
 ['8호선 산성역 2번 출구 앞에서 9번 버스를 타면 남한산성 쪽으로 올라갑니다(약 25분). 시간표는 지도 앱으로 확인하세요.','남문 → 성곽길 일부 걷기(약 2~3시간) → 행궁 → 성 안 식당가에서 닭죽 등 점심.','성 안에는 전통차를 파는 찻집과 한옥 카페가 있습니다. 가을 단풍철에는 주말에 매우 붐비니 평일을 추천합니다.'],
 ['From Sanseong Stn (Line 8), Exit 2, take bus 9 up to Namhansanseong (about 25 minutes). Check the timetable in a map app.','South Gate → walk part of the wall (2–3 hours) → Haenggung palace → lunch at the restaurants inside the fortress.','Inside the fortress you will find traditional tea houses and hanok cafes. Autumn weekends are very crowded, so weekdays are better.'],
 ['8号線 山城駅2番出口の前から9番バスに乗ると南漢山城へ上がれます（約25分）。時刻表は地図アプリで確認してください。','南門 → 城郭道の一部を歩く（約2〜3時間） → 行宮 → 城内の食堂街で昼食。','城内には伝統茶の店や韓屋カフェがあります。紅葉の秋の週末はとても混むので平日がおすすめです。'],
 ['在8号线山城站2号口前乘9路公交可上南汉山城（约25分钟），时刻表请用地图应用确认。','南门 → 走一段城郭步道（约2~3小时） → 行宫 → 在城内餐馆吃午餐。','城内有传统茶馆和韩屋咖啡馆。秋季红叶期周末人非常多，建议工作日前往。']);

T('gwanak','사당 관악산 카페 서울','사당역·서울대입구역 인근 카페',
 ['2·4호선 사당역이나 2호선 서울대입구역에서 등산로 입구까지 걸어서 또는 버스로 이동합니다. 코스가 여러 개라 지도 앱에서 출발 입구를 확인하세요.','정상 부근 연주대까지는 가파른 구간이 이어집니다. 일정에 여유가 없다면 짧은 코스만 걷고 내려오세요.','하산 후에는 사당역·서울대입구역 근처에서 식사와 카페를 즐기기 편합니다. 등산 경험이 있는 분께 맞는 산입니다.'],
 ['From Sadang Stn (Lines 2 and 4) or Seoul Nat\'l Univ. Stn (Line 2), walk or take a bus to a trailhead. There are several routes, so check the trailhead in a map app.','The climb to Yeonjudae near the summit is steep. If you are short of time, walk a shorter route and come back down.','After the hike, eating and cafe-hopping near Sadang or Seoul Nat\'l Univ. is easy. Best for people with some hiking experience.'],
 ['2・4号線 舎堂駅や2号線 ソウル大入口駅から、登山口まで徒歩またはバスで移動します。コースが複数あるので、地図アプリで入口を確認してください。','山頂付近の戀主臺（ヨンジュデ）までは急な区間が続きます。時間がなければ短いコースだけ歩いて下山しましょう。','下山後は舎堂駅やソウル大入口駅の周辺で食事やカフェを楽しめます。登山経験のある方に向いた山です。'],
 ['从2、4号线舍堂站或2号线首尔大学入口站，步行或乘公交到登山口。路线较多，请用地图应用确认入口。','山顶附近的恋主台一段很陡。时间不多的话，走较短的路线再下山。','下山后在舍堂站或首尔大学入口站附近用餐、喝咖啡都很方便。适合有登山经验的人。']);

T('namiseom','가평 남이섬 카페','남이섬 메타세쿼이아길 주변 카페',
 ['경춘선 ITX-청춘 열차나 경춘선 전철로 가평역까지 가서, 택시로 약 10분이면 남이섬 선착장입니다. 상봉역에서 가평역까지 약 1시간입니다.','가평역 → 선착장에서 배로 입장 → 메타세쿼이아길과 은행나무길 산책 → 가평역으로 돌아와 귀가. 하루 일정으로 충분합니다.','섬 안 메타세쿼이아길 주변에 쉬어 가기 좋은 카페가 있습니다. 배 운행 시간과 입장권은 공식 안내를 확인하세요.'],
 ['Take the Gyeongchun Line ITX-Cheongchun or local train to Gapyeong Stn, then a taxi (about 10 minutes) to the Nami Island pier. Sangbong to Gapyeong takes about an hour.','Gapyeong Stn → ferry to the island → walk the metasequoia and ginkgo lanes → back to Gapyeong Stn. A day trip is enough.','There are cafes near the metasequoia lane on the island. Check official notices for ferry times and tickets.'],
 ['京春線のITX-青春号または電車で加平駅まで行き、タクシーで約10分で南怡島の船着場です。上鳳駅から加平駅までは約1時間です。','加平駅 → 船着場から船で入島 → メタセコイア並木とイチョウ並木を散策 → 加平駅へ戻って帰ります。日帰りで十分です。','島内のメタセコイア並木の近くに休憩しやすいカフェがあります。船の運航時間と入場券は公式案内で確認してください。'],
 ['乘京春线ITX青春列车或普通电车到加平站，再乘出租车约10分钟到南怡岛码头；从上凤站到加平站约1小时。','加平站 → 码头乘船上岛 → 漫步水杉路和银杏路 → 回加平站返程，一天足够。','岛内水杉路附近有适合休息的咖啡馆。船班时间和门票请以官方公告为准。']);

T('achim','가평 아침고요수목원 카페','아침고요수목원 정원 카페',
 ['경춘선으로 가평역이나 청평역까지 간 뒤 택시 또는 시내버스로 이동합니다(가평역에서 30-4번 등, 시간표 확인). 서울에서 편도 약 1시간 30분을 잡으세요.','수목원 정원을 한 바퀴 돌고(약 1~2시간) → 근처 가평 시내에서 식사 → 같은 날 남이섬과 묶는 방법도 있습니다.','정원 안에 쉬어 가는 카페가 있습니다. 겨울 빛 축제 기간에는 운영 시간이 달라지니 공식 안내를 확인하세요.'],
 ['Take the Gyeongchun Line to Gapyeong or Cheongpyeong Stn, then a taxi or local bus (e.g. bus 30-4 from Gapyeong; check the timetable). Allow about 1.5 hours each way from Seoul.','Walk the garden (1–2 hours) → eat in Gapyeong town → it can be combined with Nami Island in one day.','There is a cafe inside the garden. Hours change during the winter light festival, so check the official notice.'],
 ['京春線で加平駅か清平駅まで行き、タクシーまたは市内バスで移動します（加平駅から30-4番など、時刻表を確認）。ソウルから片道約1時間30分を見てください。','庭園を一周（約1〜2時間） → 加平の街で食事 → 同じ日に南怡島と組み合わせることもできます。','庭園内に休憩できるカフェがあります。冬の光の祭りの期間は営業時間が変わるので公式案内を確認してください。'],
 ['乘京春线到加平站或清平站，再换乘出租车或市内公交（如加平站的30-4路，请确认时刻表）。从首尔单程约需1.5小时。','游览庭园一圈（约1~2小时） → 在加平市区用餐 → 也可当天与南怡岛一起游览。','庭园内有可休息的咖啡馆。冬季灯光节期间营业时间会变化，请查看官方公告。']);

/* ===== 전통 문화 ===== */
T('gbg','서촌 대오서점 서울','대오서점 (Daeo Bookstore)',
 ['3호선 경복궁역 5번 출구가 궁 정문 광화문 방향과 바로 이어집니다. 5호선 광화문역 2번 출구에서도 걸어갈 수 있습니다.','광화문 → 근정전·경회루 관람 → 서쪽 서촌 골목 → 통인시장 → 북촌까지 걸어서 이동. 화요일은 궁이 쉬는 날입니다.','서촌의 오래된 서점을 고쳐 만든 카페로, 조용히 쉬어 가기 좋습니다. 한복 입장 혜택은 공식 안내를 확인하세요.'],
 ['Exit 5 of Gyeongbokgung Stn (Line 3) leads toward the Gwanghwamun gate. You can also walk from Gwanghwamun Stn (Line 5), Exit 2.','Gwanghwamun → Geunjeongjeon and Gyeonghoeru → Seochon alleys to the west → Tongin Market → walk on to Bukchon. The palace is closed on Tuesdays.','A cafe in an old Seochon bookstore, good for a quiet rest. Check official notices for hanbok admission perks.'],
 ['3号線 景福宮駅5番出口から宮の正門・光化門方面へすぐです。5号線 光化門駅2番出口からも歩けます。','光化門 → 勤政殿・慶会楼を見学 → 西側の西村（ソチョン）の路地 → 通仁市場 → 北村まで歩いて移動。火曜日は宮が休みです。','西村の古い書店を改装したカフェで、静かに休むのに向いています。韓服での入場特典は公式案内で確認してください。'],
 ['从3号线景福宫站5号口可直达景福宫正门光化门方向，也可从5号线光化门站2号口步行。','光化门 → 勤政殿、庆会楼 → 西侧西村小巷 → 通仁市场 → 步行到北村。景福宫周二闭馆。','由西村老书店改造的咖啡馆，适合安静休息。穿韩服入场的优惠请查看官方公告。']);

T('bukchon','어니언 안국 서울','어니언 안국 (Onion Anguk)',
 ['3호선 안국역 2번 출구로 나와 북촌로를 따라 걸어서 약 10분. 오르막이 있으니 편한 신발이 좋습니다.','안국역 → 북촌 한옥마을 언덕 → 삼청동 → 경복궁. 거꾸로 경복궁에서 북촌으로 걷는 방법도 있습니다.','안국역 근처 한옥을 고친 베이커리 카페로, 현지인에게도 인기가 많습니다. 북촌은 주민 거주지라 조용히 걷는 것이 예절입니다.'],
 ['Leave Anguk Stn (Line 3) by Exit 2 and walk about 10 minutes along Bukchon-ro. There are slopes, so wear comfortable shoes.','Anguk Stn → Bukchon hanok hill → Samcheong-dong → Gyeongbokgung. You can also do the reverse from Gyeongbokgung.','A bakery cafe in a hanok near Anguk Stn that locals like too. Bukchon is a residential area, so keep your voice down.'],
 ['3号線 安国駅2番出口から北村路沿いに徒歩約10分。坂があるので歩きやすい靴がおすすめです。','安国駅 → 北村韓屋村の坂道 → 三清洞 → 景福宮。逆に景福宮から北村へ歩く方法もあります。','安国駅の近くにある韓屋を改装したベーカリーカフェで、地元の人にも人気です。北村は住民が暮らす地域なので、静かに歩くのがマナーです。'],
 ['从3号线安国站2号口出来，沿北村路步行约10分钟，有坡道，建议穿舒适的鞋。','安国站 → 北村韩屋村山坡 → 三清洞 → 景福宫，也可以反方向从景福宫走向北村。','安国站附近由韩屋改造的烘焙咖啡馆，当地人也很喜欢。北村是居民区，请保持安静。']);

T('cdg','익선동 카페 서울','익선동 한옥 카페 골목',
 ['3호선 안국역 3번 출구에서 돈화문까지 걸어서 약 5~10분. 후원(비원)은 시간제 안내 관람이라 예약·시간을 미리 확인하세요. 월요일은 휴궁입니다.','창덕궁 후원 관람 → 도보 10분 거리 익선동 → 종로3가역 방향 노포 골목에서 저녁.','익선동에는 한옥을 고쳐 만든 카페와 식당이 모여 있습니다. 낮에는 한적하고 저녁에 붐빕니다.'],
 ['Walk about 5–10 minutes from Anguk Stn (Line 3), Exit 3, to Donhwamun gate. The Secret Garden is a guided, timed visit, so check times and booking. Closed Mondays.','Secret Garden tour → Ikseon-dong (10 minutes on foot) → dinner among the old eateries near Jongno 3-ga Stn.','Ikseon-dong has cafes and restaurants in converted hanok. It is quiet by day and crowded in the evening.'],
 ['3号線 安国駅3番出口から敦化門まで徒歩約5〜10分。後苑（秘苑）は時間制のガイド付き見学なので、予約や時間を事前に確認してください。月曜は休みです。','昌徳宮の後苑を見学 → 徒歩10分の益善洞 → 鍾路3街駅方面の老舗街で夕食。','益善洞には韓屋を改装したカフェや食堂が集まっています。昼は静かで、夕方は混みます。'],
 ['从3号线安国站3号口步行约5~10分钟到敦化门。后苑（秘苑）为限时导览参观，请提前确认时间和预约。周一休馆。','参观昌德宫后苑 → 步行10分钟到益善洞 → 钟路3街站方向的老店街吃晚餐。','益善洞聚集着由韩屋改造的咖啡馆和餐厅，白天安静，傍晚人多。']);

T('insadong','귀빈재 인사동 서울','귀빈재 (Gwibinjae)',
 ['3호선 안국역 6번 출구로 나오면 인사동길 입구입니다. 1·3·5호선 종로3가역 5번 출구에서도 가깝습니다.','안국역 → 인사동길과 쌈지길 → 익선동 → 종로3가역에서 귀가. 걸어서 천천히 두세 시간이면 충분합니다.','인사동의 전통찻집으로, 쌍화차나 대추차와 한과를 곁들이며 쉬어 가기 좋습니다. 가게 위치와 영업 시간은 지도 앱으로 확인하세요.'],
 ['Exit 6 of Anguk Stn (Line 3) leads to the start of Insadong-gil. Jongno 3-ga Stn (Lines 1, 3, 5), Exit 5 is also close.','Anguk Stn → Insadong-gil and Ssamziegil → Ikseon-dong → return from Jongno 3-ga Stn. Two to three slow hours on foot is enough.','A traditional tea house in Insadong, good for ssanghwacha or jujube tea with hangwa sweets. Check the location and hours in a map app.'],
 ['3号線 安国駅6番出口を出ると仁寺洞通りの入口です。1・3・5号線 鍾路3街駅5番出口からも近いです。','安国駅 → 仁寺洞通りとサムジキル → 益善洞 → 鍾路3街駅で帰ります。歩いてゆっくり2〜3時間で十分です。','仁寺洞の伝統茶房で、双和茶やナツメ茶に韓菓を添えて休憩できます。場所と営業時間は地図アプリで確認してください。'],
 ['从3号线安国站6号口出来就是仁寺洞路入口，1、3、5号线钟路3街站5号口也很近。','安国站 → 仁寺洞路和Ssamziegil → 益善洞 → 钟路3街站回程，步行慢逛2~3小时足够。','仁寺洞的传统茶馆，可点双和茶或红枣茶配韩果点心。位置和营业时间请用地图应用确认。']);

T('dsg','정동길 카페 서울','정동길 · 덕수궁 돌담길 카페',
 ['1·2호선 시청역 2번 출구에서 바로 덕수궁 대한문이 보입니다. 월요일은 휴궁입니다.','덕수궁 관람 → 돌담길과 정동길 산책 → 서울시립미술관 → 청계천(시청역에서 걸어서 약 10분)까지 이어 걷기.','정동길 주변에 오래된 건물을 고친 카페와 찻집이 있습니다. 돌담길은 가을 은행잎 철에 특히 인기입니다.'],
 ['Exit 2 of City Hall Stn (Lines 1 and 2) puts Daehanmun gate in sight. Closed on Mondays.','Deoksugung Palace → stone wall road and Jeongdong-gil → Seoul Museum of Art → walk on to Cheonggyecheon (about 10 minutes from City Hall).','Cafes and tea rooms in restored old buildings line Jeongdong-gil. The wall road is especially popular during the autumn ginkgo season.'],
 ['1・2号線 市庁駅2番出口を出るとすぐ徳寿宮の大漢門が見えます。月曜は休みです。','徳寿宮を見学 → 石垣道と貞洞通りを散策 → ソウル市立美術館 → 清渓川（市庁駅から徒歩約10分）まで歩き続けます。','貞洞通りの周辺には古い建物を改装したカフェや茶房があります。石垣道は秋のイチョウの季節に特に人気です。'],
 ['1、2号线市厅站2号口出来就能看到德寿宫大汉门，周一休馆。','参观德寿宫 → 石墙路和贞洞路散步 → 首尔市立美术馆 → 继续走到清溪川（从市厅站步行约10分钟）。','贞洞路周边有由老建筑改造的咖啡馆和茶馆。石墙路在秋季银杏季尤其受欢迎。']);

T('suwon','수원 행궁동 카페거리','행궁동 카페거리 (Haenggung-dong)',
 ['1호선 수원역(서울역·용산역에서 급행으로 약 1시간 안팎)에서 시내버스나 택시로 약 10~15분이면 화성 팔달문 일대입니다.','장안문 → 성곽을 따라 화서문 → 팔달산 → 화성행궁 → 행궁동 카페거리. 성곽 한 바퀴는 걸어서 약 3시간입니다.','화성행궁 앞 행궁동은 한옥과 작은 카페, 공방이 모인 골목으로 현지 젊은 층에게 인기입니다. 서울로 돌아올 때는 수원역에서 1호선을 타세요.'],
 ['From Suwon Stn (Line 1; about an hour by express from Seoul Stn or Yongsan), a local bus or taxi takes 10–15 minutes to the Paldalmun gate area.','Janganmun gate → follow the wall to Hwaseomun → Paldalsan → Hwaseong Haenggung → Haenggung-dong cafe street. Walking the full wall takes about 3 hours.','Haenggung-dong in front of the palace has hanok, small cafes and workshops popular with young locals. Return to Seoul by Line 1 from Suwon Stn.'],
 ['1号線 水原駅（ソウル駅・龍山駅から急行で約1時間前後）から、市内バスかタクシーで約10〜15分で八達門一帯です。','長安門 → 城郭沿いに華西門 → 八達山 → 華城行宮 → 行宮洞カフェ通り。城郭を一周するには徒歩で約3時間です。','華城行宮の前の行宮洞は、韓屋や小さなカフェ、工房が集まる路地で地元の若者に人気です。ソウルへは水原駅から1号線で帰ります。'],
 ['乘1号线到水原站（从首尔站、龙山站乘快车约1小时左右），再换公交或出租车约10~15分钟到八达门一带。','长安门 → 沿城郭到华西门 → 八达山 → 华城行宫 → 行宫洞咖啡街。走完城郭一圈约3小时。','华城行宫前的行宫洞聚集着韩屋、小咖啡馆和工坊，深受当地年轻人欢迎。回首尔可在水原站乘1号线。']);

/* ===== 시장과 노포 ===== */
T('gwangjang','커피한약방 을지로 서울','커피한약방 (Coffee Hanyakbang)',
 ['1호선 종로5가역 7·8번 출구에서 걸어서 약 3분입니다. 청계천 쪽으로도 열려 있어 걷기 좋습니다.','광장시장에서 빈대떡·마약김밥·육회 → 청계천 산책 → 을지로 쪽으로 걸어 올라가 카페 → 종로3가에서 귀가.','을지로3가에 있는 오래된 한약방을 고친 카페입니다(광장시장에서 걸어서 약 15분). 시장 점심 시간대는 줄이 길어서 오전 일찍이 좋습니다.'],
 ['It is about a 3-minute walk from Jongno 5-ga Stn (Line 1), Exits 7 and 8. The market also opens toward Cheonggyecheon for a pleasant walk.','Bindaetteok, mayak gimbap and yukhoe at Gwangjang → Cheonggyecheon walk → walk up to Euljiro for a cafe → return from Jongno 3-ga.','A cafe in an old herbal medicine shop in Euljiro 3-ga (about 15 minutes on foot from Gwangjang). Lunch lines are long, so go early.'],
 ['1号線 鍾路5街駅7・8番出口から徒歩約3分です。清渓川側にも出入口があり、歩きやすいです。','広蔵市場でピンデトク・麻薬キンパ・ユッケ → 清渓川を散策 → 乙支路方面へ歩いてカフェ → 鍾路3街から帰ります。','乙支路3街にある古い漢方薬局を改装したカフェです（広蔵市場から徒歩約15分）。昼は行列ができるので早めの時間がおすすめです。'],
 ['从1号线钟路5街站7、8号口步行约3分钟，市场也通向清溪川一侧，适合散步。','在广藏市场吃绿豆煎饼、麻药紫菜卷饭、生拌牛肉 → 清溪川散步 → 走向乙支路喝咖啡 → 从钟路3街回程。','位于乙支路3街、由老中药铺改造的咖啡馆（从广藏市场步行约15分钟）。午餐时间要排队，建议早些去。']);

T('jongno3ga','익선동 카페 종로3가','익선동 한옥 카페 골목',
 ['1·3·5호선 종로3가역에서 내리면 노포 골목이 바로 이어집니다. 익선동과 낙원상가도 걸어서 3~5분 거리입니다.','종로3가 포장마차 골목 저녁 → 낙원상가 구경 → 익선동 카페에서 후식 → 종로3가역에서 지하철로 귀가.','익선동 한옥 골목에는 카페가 많아 식후 커피로 알맞습니다. 노포는 현금만 받는 곳이 있으니 현금을 준비하세요.'],
 ['The old-eatery lanes start right outside Jongno 3-ga Stn (Lines 1, 3, 5). Ikseon-dong and Nakwon Arcade are 3–5 minutes on foot.','Evening in the pocha alleys of Jongno 3-ga → Nakwon Arcade → dessert at a cafe in Ikseon-dong → subway home from Jongno 3-ga.','The hanok alleys of Ikseon-dong have plenty of cafes for after-dinner coffee. Some old eateries are cash only, so carry cash.'],
 ['1・3・5号線 鍾路3街駅を降りるとすぐに老舗の路地が続きます。益善洞や楽園楽器商店街も徒歩3〜5分です。','鍾路3街の屋台通りで夕食 → 楽園楽器商店街を見学 → 益善洞のカフェでデザート → 鍾路3街駅から地下鉄で帰ります。','益善洞の韓屋の路地には食後のコーヒーに向いたカフェが多くあります。老舗は現金のみの店があるので現金をご用意ください。'],
 ['在1、3、5号线钟路3街站下车，老店街就在出口外，益善洞和乐园乐器商街步行约3~5分钟。','钟路3街大排档小巷吃晚餐 → 逛乐园乐器商街 → 益善洞咖啡馆吃甜点 → 从钟路3街站乘地铁回程。','益善洞韩屋小巷里咖啡馆很多，饭后喝咖啡正合适。部分老店只收现金，请备好现金。']);

T('eulji','커피한약방 을지로 서울','커피한약방 (Coffee Hanyakbang)',
 ['2·3호선 을지로3가역 근처에 가게가 모여 있습니다. 출구가 많으니 지도 앱에서 목적지에 가까운 출구를 고르세요.','을지로3가역 → 인쇄소 골목과 노가리 골목 → 커피한약방에서 후식 → 청계천 산책. 노포 골목은 저녁이 분위기가 좋습니다.','오래된 한약방을 고친 을지로의 카페입니다. 간판이 작고 골목 안쪽이라 지도 앱으로 찾아가세요. 일부 가게는 일요일에 쉽니다.'],
 ['The shops cluster around Euljiro 3-ga Stn (Lines 2 and 3). There are many exits, so pick the one closest to your destination in a map app.','Euljiro 3-ga Stn → printing-shop alleys and Nogari Alley → dessert at Coffee Hanyakbang → walk along Cheonggyecheon. The old alleys feel best in the evening.','A cafe in an old herbal-medicine shop in Euljiro. The sign is small and it sits inside an alley, so use a map app. Some shops close on Sundays.'],
 ['店は2・3号線 乙支路3街駅の周辺に集まっています。出口が多いので、地図アプリで目的地に近い出口を選んでください。','乙支路3街駅 → 印刷所の路地とノガリ横丁 → コーヒー漢方薬房でデザート → 清渓川を散策。老舗の路地は夕方が雰囲気よいです。','古い漢方薬局を改装した乙支路のカフェです。看板が小さく路地の奥にあるので、地図アプリで探してください。日曜休みの店もあります。'],
 ['店铺集中在2、3号线乙支路3街站周边，出口很多，请用地图应用选择离目的地最近的出口。','乙支路3街站 → 印刷店小巷和明太鱼干小巷 → 在咖啡韩药房吃甜点 → 清溪川散步，老街傍晚最有氛围。','乙支路由老中药铺改造的咖啡馆，招牌很小且在小巷深处，请用地图应用寻找。部分店周日休息。']);

T('tongin','효자베이커리 서촌 서울','효자베이커리 (Hyoja Bakery)',
 ['3호선 경복궁역 2번 출구에서 걸어서 약 10분입니다. 시장은 경복궁 서쪽 서촌 골목 안에 있습니다.','경복궁 관람 → 서촌 골목 산책 → 통인시장에서 엽전 도시락 → 서촌 카페 → 인왕산 방향 산책. 도시락 카페는 점심에 붐빕니다.','경복궁과 청와대 방향 길에 있는 오래된 빵집입니다. 서촌에는 이 밖에도 아기자기한 카페가 많습니다.'],
 ['It is about a 10-minute walk from Gyeongbokgung Stn (Line 3), Exit 2. The market lies in the Seochon alleys west of the palace.','Gyeongbokgung → Seochon alleys → yeopjeon lunch box at Tongin Market → a Seochon cafe → stroll toward Inwangsan. The lunch-box cafe is busy at noon.','A long-running bakery on the road toward the former Blue House. Seochon has many other charming cafes as well.'],
 ['3号線 景福宮駅2番出口から徒歩約10分です。市場は景福宮の西、西村の路地の中にあります。','景福宮を見学 → 西村の路地を散策 → 通仁市場で葉銭（ヨプチョン）弁当 → 西村のカフェ → 仁王山方面へ散歩。弁当カフェは昼に混みます。','景福宮と旧青瓦台方面へ向かう道にある老舗のパン屋です。西村にはほかにも素敵なカフェがたくさんあります。'],
 ['从3号线景福宫站2号口步行约10分钟，市场位于景福宫西侧的西村小巷里。','参观景福宫 → 西村小巷散步 → 在通仁市场用铜钱买便当 → 西村咖啡馆 → 向仁王山方向散步。便当咖啡馆中午人多。','位于通往景福宫和旧青瓦台路上的老面包店，西村还有很多别致的咖啡馆。']);

T('namdaemun','회현동 카페 서울','회현동·서울로7017 인근 카페',
 ['4호선 회현역 5번 출구에서 걸어서 약 3분입니다. 서울역에서도 걸어서 10분 안팎입니다.','남대문시장에서 칼국수·갈치조림 → 서울로7017 공중 산책로 → 서울역 → 필요하면 명동까지 걸어서 이동(약 15분).','회현역과 서울역 사이에 작은 카페가 있습니다. 시장은 일요일에 쉬는 가게가 많고 상점 영업 시간이 이른 편이니 오전~낮에 방문하세요.'],
 ['It is about a 3-minute walk from Hoehyeon Stn (Line 4), Exit 5, and roughly 10 minutes on foot from Seoul Station.','Kalguksu and braised hairtail at Namdaemun → Seoullo 7017 skywalk → Seoul Station → walk to Myeong-dong (about 15 minutes) if you like.','Small cafes sit between Hoehyeon Stn and Seoul Station. Many market shops close on Sundays and open early, so visit from morning to afternoon.'],
 ['4号線 会賢駅5番出口から徒歩約3分です。ソウル駅からも徒歩10分前後です。','南大門市場でカルグクスやタチウオの煮付け → ソウル路7017の空中散歩道 → ソウル駅 → 必要なら明洞まで歩いて移動（約15分）。','会賢駅とソウル駅の間に小さなカフェがあります。市場は日曜に休む店が多く、営業時間も早めなので午前〜昼に訪れてください。'],
 ['从4号线会贤站5号口步行约3分钟，从首尔站步行约10分钟。','在南大门市场吃刀削面、辣炖带鱼 → 首尔路7017空中步道 → 首尔站 → 需要的话步行约15分钟到明洞。','会贤站和首尔站之间有小咖啡馆。市场里很多店周日休息且开门较早，建议上午到下午前往。']);

const LB={
 ko:{h:'현지인 팁',s:'지하철·이동',c:'추천 코스',f:'현지인 추천 카페',m:'지도에서 보기',n:'영업 여부와 운영 시간은 방문 전에 구글지도에서 확인하세요.'},
 en:{h:'Local tips',s:'Getting there by subway',c:'Suggested course',f:'Cafe locals like',m:'View on map',n:'Please check opening status and hours on Google Maps before you go.'},
 ja:{h:'地元の人のヒント',s:'地下鉄・移動',c:'おすすめコース',f:'地元の人が通うカフェ',m:'地図で見る',n:'営業状況や営業時間は訪問前にGoogleマップで確認してください。'},
 zh:{h:'本地人小贴士',s:'地铁与交通',c:'推荐路线',f:'本地人推荐咖啡馆',m:'在地图上查看',n:'营业状态和时间请在出发前用谷歌地图确认。'}
};
window.PLACE_TIPS=TIPS;window.TIPS_LABEL=LB;
})();
