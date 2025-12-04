// kb.js — BO Q&A PCVL Assistant (Bản đầy đủ – dạng A)
export const knowledge = [
/* ===========================
   BỘ 1: TIẾT KIỆM ĐIỆN LÀ GÌ
   =========================== */
{ q:"Tiết kiệm điện là gì?", a:"Tiết kiệm điện là sử dụng điện hiệu quả và không lãng phí." },
{ q:"Làm cách nào để sử dụng điện tiết kiệm?", a:"Sử dụng điện tiết kiệm là sử dụng đúng lúc, đúng chỗ, đúng cách và đúng nhu cầu; không sử dụng nữa thì tắt ngay." },
{ q:"Làm cách nào để sử dụng điện hiệu quả?", a:"Sử dụng điện đúng cách, dùng một lượng ít nhất mà vẫn đáp ứng nhu cầu sử dụng." },
{ q:"Làm cách nào để sử dụng điện không lãng phí?", a:"Sử dụng điện đúng lúc, đúng chỗ, đủ nhu cầu, không dùng nữa thì tắt ngay." },
{ q:"Tiết kiệm điện mang lại lợi ích gì?", a:"Tiết kiệm được tiền cho gia đình và quốc gia, giảm 10 đến 20% tiền điện hằng tháng, không bị cúp điện thường xuyên do thiếu nguồn. Góp phần bảo vệ sự trong lành của môi trường - Chính là bảo vệ sức khỏe cho gia đình xã hội." },
/* ===========================
   BỘ 2: TIẾT KIỆM ĐIỆN TRONG TRƯỜNG HỌC
   =========================== */
{ q:"Làm cách nào để sử dụng tiết kiệm trong trường học?", a:"Tắt đèn chiếu sáng và quạt khi ra khỏi phòng vào giờ ra chơi và hết giờ học. Nên mở cửa sổ tận dụng nguồn ánh sáng và gió tự nhiên." },
{ q:"Làm cách nào để sử dụng điện tiết kiệm trong phòng thí nghiệm?", a:"Tắt các thiết bị thực hành khi không sử dụng (Máy tính, máy lạnh). Tắt các thiết bị điện không cần thiết vào giờ ra chơi (Đèn, máy lạnh, …)." },
/* ===========================
   BỘ 3: TIẾT KIỆM ĐIỆN TRONG GIA ĐÌNH
   =========================== */
{ q:"Có nên tắt thiết bị điện khi không dùng không?", a:"Nên tắt ngay, vì thiết bị ở chế độ chờ vẫn ngốn điện và làm tăng hóa đơn." },
{ q:"Đèn sợi đốt và huỳnh quang có tốn điện hơn đèn LED, đèn Compact, đèn tuýp gầy không?", a:"Có. Đèn LED tiết kiệm 70 đến 80% điện và bền hơn." },
{ q:"Ban ngày có cần bật đèn không?", a:"Không, nên tận dụng ánh sáng tự nhiên từ cửa sổ." },
{ q:"Điều hòa bật 18°C có tốt không?", a:"Không. Nhiệt độ phù hợp 26 đến 28°C, kết hợp quạt vẫn mát và tiết kiệm." },
{ q:"Máy giặt dùng thế nào để tiết kiệm điện?", a:"Gom đủ quần áo rồi giặt 1 lần để giảm điện năng." },
{ q:"Thiết bị nào hay bị quên rút điện?", a:"Sạc điện thoại, nồi cơm, laptop… dễ gây hao điện ngầm." },
{ q:"Có nên thay tủ lạnh cũ không?", a:"Nên, tủ lạnh inverter tiết kiệm 30–50% điện." },
{ q:"Quạt có tốn điện như điều hòa không?", a:"Không. Kết hợp quạt + điều hòa giảm một nửa điện năng." },
{ q:"Nồi cơm để hâm cả ngày có phí điện không?", a:"Có. Nên rút phích khi không dùng." },
{ q:"Đèn ngoài sân nên dùng loại nào?", a:"Đèn LED, cảm biến hoặc năng lượng mặt trời." },
{ q:"Máy tính bàn có tốn điện hơn laptop không?", a:"Có. Laptop chỉ dùng 1/3 điện năng của máy bàn." },
{ q:"Có nên dùng bình nóng lạnh tiết kiệm không?", a:"Có, nên chọn loại Eco hoặc năng lượng mặt trời." },
{ q:"Gia đình đông người tiết kiệm điện bằng cách nào?", a:"Sắp xếp giờ dùng điện hợp lý, tránh dùng đồng loạt." },
{ q:"Bếp từ có tiết kiệm điện không?", a:"Có, Bếp từ tiết kiệm, an toàn hơn, nên dùng inverter." },
{ q:"Máy bơm nước có tốn điện không?", a:"Có. Nên chọn bơm tự động có rơ-le." },
{ q:"Nồi chiên không dầu dùng nhiều có tốn điện không?", a:"Có. Nên nấu lượng vừa đủ và hạn chế mở nắp." },
{ q:"Có nên rút sạc điện thoại khi đầy pin?", a:"Nên rút để tiết kiệm điện và tránh chai pin." },
{ q:"Quạt hơi nước tiết kiệm điện hơn điều hòa không?", a:"Có. Phù hợp phòng nhỏ và tiêu thụ ít điện." },
{ q:"Có nên bật nhiều thiết bị công suất lớn cùng lúc?", a:"Không. Dễ gây quá tải và tăng điện năng." },
{ q:"Nên chọn bàn ủi đồ loại nào để tiết kiệm điện?", a:"Nên chọn bàn ủi có rơ-le nhiệt. Tập trung nhiều đồ ủi trong một lần để tiết kiệm điện, cài đặt nhiệt độ bàn ủi thích hợp với loại vải cần ủi." },
{ q:"Nên chọn máy bơm nước loại nào để tiết kiệm điện?", a:"Nên chọn máy bơm nước phù hợp với công suất cần sử dụng, vì máy có công suất lớn hơn nhu cầu sẽ tiêu thụ điện nhiều hơn." },
/* ===========================
   BỘ 4: TIẾT KIỆM ĐIỆN TẠI NƠI LÀM VIỆC
   =========================== */
{ q:"Vì sao cần tuyên truyền tiết kiệm điện ở cơ quan?", a:"Để nâng cao ý thức, giảm chi phí vận hành, bảo vệ môi trường." },
{ q:"Khi nào nên bật điều hòa trong phòng làm việc?", a:"Chỉ khi cần, để 26–28°C và kết hợp quạt." },
{ q:"Có nên bật điều hòa cả ngày?", a:"Không. Nên tắt khi họp hoặc phòng trống." },
{ q:"Thiết bị văn phòng nào nên dùng loại tiết kiệm điện?", a:"Máy in, photocopy, màn hình, bóng đèn – ưu tiên inverter hoặc LED." },
{ q:"In ấn nhiều có tốn điện không?", a:"Có. Chỉ in khi cần và ưu tiên in hai mặt." },
{ q:"Có nên photo tài liệu nhiều không?", a:"Hạn chế. Nên dùng file mềm thay bản giấy." },
{ q:"Có nên bật đèn ban ngày trong văn phòng?", a:"Không. Nên tận dụng ánh sáng tự nhiên." },
{ q:"Làm sao nâng cao ý thức tiết kiệm điện cho nhân viên?", a:"Dán nhắc nhở, truyền thông và khen thưởng tập thể thực hiện tốt." },
{ q:"Hết giờ làm cần làm gì với thiết bị điện?", a:"Tắt toàn bộ: đèn, quạt, điều hòa, máy tính, máy in." },
{ q:"Có cần rút phích cắm khi tắt thiết bị không?", a:"Có. Chế độ chờ vẫn tiêu thụ điện." },
{ q:"Hệ thống điện có cần kiểm tra định kỳ không?", a:"Có. Để phát hiện dây cũ, rò điện." },
{ q:"Đèn văn phòng nên dùng loại nào?", a:"Đèn LED tiết kiệm 50–70% điện." },
{ q:"Máy tính không dùng có nên để Sleep không?", a:"Có. Sleep tiết kiệm điện hơn để chạy liên tục." },
{ q:"Điều hòa có cần bảo dưỡng định kỳ không?", a:"Có. Giúp máy mát hơn và tiết kiệm điện." },
{ q:"Tiết kiệm điện tập thể lợi gì?", a:"Giảm 10 đến 20% tiền điện cho cơ quan." },
{ q:"Thang máy dùng nhiều có tốn điện không?", a:"Có. Nên đi thang bộ cho tầng thấp." },
{ q:"Server chạy liên tục có tốn điện không?", a:"Có. Nên cấu hình chế độ tiết kiệm." },
{ q:"Máy bơm tòa nhà cần quản lý giờ chạy không?", a:"Có. Nên đặt giờ và kiểm tra rò rỉ." },
{ q:"Có nên để màn hình sáng tối đa cả ngày?", a:"Không. Giảm độ sáng tiết kiệm 10–20% điện." },
{ q:"Phòng họp ít dùng có bật sẵn thiết bị không?", a:"Không. Chỉ bật khi họp." },
/* ===========================
   BỘ 5: TIẾT KIỆM ĐIỆN TRONG SINH HOẠT CỘNG ĐỒNG
   =========================== */
{ q:"Tại sao cần tiết kiệm điện trong cộng đồng?", a:"Nâng cao ý thức chung, giảm chi phí và bảo vệ môi trường." },
{ q:"Cộng đồng có thể tổ chức hoạt động gì?", a:"Chiến dịch Giờ Trái Đất, truyền thông xanh…" },
{ q:"Đèn công cộng nên dùng loại nào?", a:"Đèn LED hoặc năng lượng mặt trời." },
{ q:"Khi nào bật đèn công cộng?", a:"Khi cần thiết, tắt khi trời sáng." },
{ q:"Có nên để đèn công cộng sáng cả ngày?", a:"Không. Rất lãng phí." },
{ q:"Làm sao địa phương thực hiện tiết kiệm điện hiệu quả?", a:"Phối hợp đoàn thể, trường học, cơ quan tuyên truyền." },
{ q:"Người dân tham gia bằng cách nào?", a:"Tắt đèn đúng giờ, dùng thiết bị tiết kiệm." },
{ q:"Điện mặt trời công cộng lợi gì?", a:"Tiết kiệm ngân sách và giảm tải lưới điện." },
{ q:"Sự kiện cộng đồng nên lồng ghép thông điệp gì?", a:"Tiết kiệm điện – bảo vệ môi trường." },
{ q:"Cộng đồng cùng tiết kiệm điện được lợi gì?", a:"Giảm chi phí công ích và môi trường sạch đẹp." },
/* ===========================
   BỘ 6: CÁC BIỆN PHÁP SỬ DỤNG ĐIỆN AN TOÀN
   =========================== */
{ q:"Ra khỏi nhà phải làm gì để tránh chạm chập?", a:"Cắt cầu dao điện tổng." },
{ q:"Tay ướt có được chạm thiết bị điện không?", a:"Không. Rất nguy hiểm." },
{ q:"Trước khi sửa điện cần làm gì?", a:"Cắt cầu dao và treo bảng cảnh báo." },
{ q:"Xử lý khi thấy người bị điện giật?", a:"Cắt điện và dùng vật cách điện tách nạn nhân." },
{ q:"Phát hiện nguy cơ mất an toàn điện thì làm gì?", a:"Báo ngay cho ngành điện hoặc chính quyền." },
{ q:"Có được dùng điện bẫy chuột, chích bắt cá hoặc chống trộm không?", a:"Không. Vi phạm pháp luật và nguy hiểm." },
{ q:"Nối dây dẫn điện thế nào cho an toàn?", a:"Nối sole và quấn băng keo cách điện." },
{ q:"Thiết bị vỏ kim loại có cần nối đất không?", a:"Có. Để tránh rò điện." },
{ q:"Hành động sai khi cứu người điện giật?", a:"Tạt nước hoặc đắp bùn lên người nạn nhân." },
{ q:"Cách an toàn cứu người bị điện giật?", a:"Đứng trên vật cách điện và dùng gậy gỗ kéo nạn nhân." },
/* ===========================
   BỘ 7: HÀNH LANG AN TOÀN LƯỚI ĐIỆN CAO ÁP
   =========================== */
{ q:"Hành lang an toàn lưới điện cao áp là gì?", a:"Khoảng không gian bảo vệ quanh đường dây và trạm điện cao áp." },
{ q:"Có được xây nhà trong hành lang điện không?", a:"Không được. Nguy hiểm và vi phạm pháp luật." },
{ q:"Có được trồng cây cao trong hành lang điện không?", a:"Không được. Dễ vi phạm khoảng cách an toàn." },
{ q:"Có được thả diều gần đường dây điện không?", a:"Tuyệt đối không. Vì có nguy cơ bay vào đường dây điện." },
{ q:"Có được treo bảng quảng cáo lên cột điện không?", a:"Không được. Nguy hiểm và vi phạm pháp luật." },
{ q:"Có được treo phơi quần áo, đồ dùng lên dây dẫn điện không?", a:"Không được. Nguy hiểm và vi phạm pháp luật." },
{ q:"Có được bắn chim đậu trên dây điện, trạm điện không?", a:"Không được. Nguy hiểm và vi phạm pháp luật." },
{ q:"Có được tung, ném bất kỳ vật gì lên đường dây điện, trạm điện không?", a:"Không được. Nguy hiểm và vi phạm pháp luật." },
{ q:"Có được tự ý trèo lên cột điện, trạm điện để làm bất cứ việc gì không?", a:"Không được. Nguy hiểm và vi phạm pháp luật." },
{ q:"Có được đốt rác dưới đường dây không?", a:"Không. Rất nguy hiểm." },
{ q:"Có được dùng xe cẩu hoặc dựng giàn giáo trong hành lang điện?", a:"Không được, nếu không có biện pháp an toàn và được phép." },
{ q:"Có được buộc ghe thuyền, trâu bò hoặc gia súc khác vào cột điện, dây chằng cột điện không?", a:"Không được. Nguy hiểm và vi phạm pháp luật." },
{ q:"Có được dựng anten TV, dây chằng néo gần đường dây điện không?", a:"Không được. Rất nguy hiểm." },
{ q:"Có được tập kết vật liệu dưới đường dây không?", a:"Không được. Dễ gây cháy nổ hoặc cản trở kiểm tra." },
{ q:"Tại sao không đứng dưới đường dây cao áp?", a:"Dễ bị phóng điện, nguy hiểm tính mạng." },
/* ===========================
   BỘ 8: THỜI HẠN THANH TOÁN TIỀN ĐIỆN
   =========================== */
{ q:"Thời hạn thanh toán tiền điện?", a:"Trong vòng 5 ngày kể từ ngày Bên bán điện có thông báo tiền điện đầu tiên." },
{ q:"Các hình thức nhận thông báo thanh toán tiền điện?", a:"Qua Zalo, SMS, ứng dụng CSKH…" },
{ q:"Thanh toán trễ có bị phạt không?", a:"Có, tính lãi theo hợp đồng." },
{ q:"Thanh toán trước hạn được không?", a:"Được, tránh bị ngừng điện." },
{ q:"Có thanh toán tự động không?", a:"Có, đăng ký trích nợ tại ngân hàng." },
{ q:"Các hình thức thanh toán tiền điện?", a:"Thanh toán tại Ngân hàng, ví điện tử (MoMo, ZaloPay, ViettelPay…)" },
{ q:"Mất biên lai thì sao?", a:"Tra cứu và in hóa đơn điện tử trên ứng dụng/website CSKH." },
{ q:"Thanh toán dư xử lý thế nào?", a:"Trừ kỳ sau hoặc hoàn trả." },
{ q:"Có thể nhờ người khác thanh toán hộ không?", a:"Có, chỉ cần đúng mã khách hàng." },
{ q:"Không nhận được hóa đơn thì sao?", a:"Tra cứu trên app CSKH hoặc gọi 19001006 – 19009000." },
/* ===========================
   BỘ 9: THỜI HẠN NGỪNG CẤP ĐIỆN DO QUÁ HẠN THANH TOÁN TIỀN ĐIỆN
   =========================== */
{ q:"Thời hạn bị ngừng cấp điện do quá hạn thanh toán tiền điện?", a:"Nếu quá thời hạn thanh toán trong vòng 7 ngày, Bên bán điện thực hiện ngừng cung cấp điện." },
{ q:"Có thông báo trước khi ngừng cung cấp điện không?", a:"Có, gửi thông báo trước 24 giờ qua tin nhắn SMS, Email, Zalo, ứng dụng chắm sóc khách hàng (App CSKH EVNSPC)." },
{ q:"Ngành điện có chịu trách nhiệm thiệt hại không?", a:"Không chịu trách nhiệm với thiệt hại do ngừng điện." },
{ q:"Bị ngừng điện có tốn phí gì?", a:"Có, phí đóng/cắt điện." },
{ q:"Thông báo ngừng điện xem ở đâu?", a:"Báo, Đài truyền thanh, trên website www.pcvinhlong.evnspc.vn và gửi tin nhắn qua (Zalo, ứng dụng CSKH, SMS, …)." },
/* ===========================
   BỘ 10: CÁC MỨC THU CHI PHÍ ĐÓNG/CẮT ĐIỆN
   =========================== */
{ q:"Khách hàng sử dụng điện sinh hoạt, chi phí đóng/cắt điện cấp điện áp 0,38 kV trở xuống?", a:"98.000 đồng/lần (chưa VAT)." },
{ q:"Khách hàng sử dụng điện sinh hoạt, chi phí đóng/cắt điện cấp điện áp từ 0,38 kV đến 35 kV?", a:"231.000 đồng/lần (chưa VAT)." },
{ q:"Khách hàng sử dụng điện sinh hoạt, chi phí đóng/cắt điện cấp điện áp trên 35 kV?", a:"339.000 đồng/lần (chưa VAT)." },
{ q:"Khách hàng sử dụng điện ngoài mục đích sinh hoạt, chi phí đóng/cắt điện (tùy theo cấp điện áp và khoảng cách từ trụ sở ngành điện đến địa điểm thực hiện ngừng, cấp điện trở lại)?", a:"Từ 98.000 đến 576.300 đồng/lần (chưa VAT)." },
{ q:"Giải pháp tránh bị ngừng điện?", a:"Thanh toán sớm hoặc đăng ký trích nợ tự động." },
/* ===========================
   BỘ 11: KHÔNG NẰM TRONG PHẠM VI HỖ TRỢ
   =========================== */
{ 
  q: "Xin lỗi! Thông tin Bạn yêu cầu không nằm trong phạm vi hỗ trợ.", 
  a: "Bạn vui lòng truy cập website: www.pcvinhlong.evnspc.vn hoặc liên hệ Tổng đài chăm sóc khách hàng: 19001006 – 19009000 để được hỗ trợ thêm!" 
}
];
