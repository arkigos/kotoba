export function authorGeometryDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@図形':'geometric figure; shape','B1@正方形':'square','B1@長方形':'rectangle',
 'B1@四角':'four-sided shape; quadrilateral','B1@四角い':'square; rectangular',
 'B1@三角':'triangle; triangular shape','B1@楕円':'ellipse; oval',
 'B1@センチ':'centimeter','B1@円周':'circumference','B1@半径':'radius','B1@直径':'diameter',
 'B1@角度':'angle','B1@直角':'right angle','B1@直線':'straight line','B1@曲線':'curve',
 'B1@水平':'horizontal; level','B1@垂直':'vertical; perpendicular','B1@斜め':'diagonal; slanting',
 'B1@図表':'chart; graph; diagram','B1@整数':'integer','B1@マイナス':'minus; negative',
 'B1@イコール':'equal; equals sign','B1@掛け算':'multiplication','B1@引き算':'subtraction',
 'B1@割り算':'division','B1@等分':'division into equal parts',
 '@円':'circle; geometric circle','@辺':'side of a geometric shape',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('science');
lesson('four-sided-shapes','Four-sided shapes',['B1@図形','B1@四角','B1@四角い'],
 '図形 / 四角 / 四角いN','図形 is a geometric shape or figure. 四角 names a four-sided shape; 四角い describes something square or rectangular. It does not by itself specify equal sides.',[
 ['@紙 に @簡単 な B1@図形 を @描く~描きました~かきました','I drew a simple shape on paper.'],
 ['@二つ の B1@図形 の @大きい~大きさ~おおきさ を @比べる~比べました~くらべました','I compared the sizes of the two shapes.'],
 ['@この B1@図形 を @赤い @線 で @描く~描いて~かいて ください','Please draw this shape with a red line.'],
 ['@ノート に @大きい B1@四角 を @描く~描きました~かきました','I drew a large four-sided shape in my notebook.'],
 ['B1@四角 の @中 に @名前 を @書く~書きました~かきました','I wrote my name inside the box.'],
 ['@この B1@四角 の @辺 は @四つ @ある~あります~あります','This quadrilateral has four sides.'],
 ['B1@四角い @紙 を @二つ に @折る~折りました~おりました','I folded the rectangular sheet of paper in two.'],
 ['@この @箱 は B1@四角い です','This box is rectangular.'],
 ['B1@四角い @窓 から @外 を @見る~見ました~みました','I looked outside through the rectangular window.'],
]);
lesson('squares-and-rectangles','Squares and rectangles',['B1@正方形','B1@長方形'],
 '正方形 / 長方形','正方形 is a square, with four equal sides and four right angles. In everyday use, 長方形 usually describes a rectangle with two longer and two shorter sides.',[
 ['B1@正方形 の @紙 を @使う~使います~つかいます','I use a square sheet of paper.'],
 ['B1@正方形 の @四つ の @辺 は @同じ @長い~長さ~ながさ です','The four sides of a square have the same length.'],
 ['@ノート に @小さい B1@正方形 を @描く~描きました~かきました','I drew a small square in my notebook.'],
 ['B1@長方形 の @紙 に @名前 を @書く~書きました~かきました','I wrote my name on a rectangular sheet of paper.'],
 ['B1@長方形 の @紙 を @切る~切りました~きりました','I cut a rectangular sheet of paper.'],
 ['B1@長方形 の @中 に @二つ の B1@正方形 を @描く~描きました~かきました','I drew two squares inside the rectangle.'],
]);
lesson('triangles-and-ovals','Triangles and ovals',['B1@三角','B1@楕円'],
 '三角 / 楕円','三角 is a triangle or triangular shape. 楕円 names an ellipse or oval.',[
 ['@紙 を B1@三角 に @折る~折りました~おりました','I folded the paper into a triangle.'],
 ['@赤い B1@三角 の @中 に @数字 を @書く~書きました~かきました','I wrote a number inside the red triangle.'],
 ['B1@三角 の @辺 は @三つ @ある~あります~あります','A triangle has three sides.'],
 ['@紙 に @大きい B1@楕円 を @描く~描きました~かきました','I drew a large oval on paper.'],
 ['@この @鏡 は B1@楕円 の @形 です','This mirror is oval-shaped.'],
 ['B1@楕円 と @円 の @形 を @比べる~比べました~くらべました','I compared the shapes of an ellipse and a circle.'],
]);
lesson('circle-measurements','Measuring circles',['B1@センチ','B1@半径','B1@直径','B1@円周'],
 'センチ / 半径 / 直径 / 円周','円 here names a circle. 半径 runs from the center to the edge; 直径 crosses the center from one edge to the other. 円周 is the distance all the way around.',[
 ['@この @線 は @五 B1@センチ です','This line is five centimeters long.'],
 ['B1@定規 で @十 B1@センチ の @線 を @引く~引きました~ひきました','I drew a ten-centimeter line with a ruler.'],
 ['@紙 の @長い~長さ~ながさ を B1@センチ で B1@測定 @する~しました~しました','I measured the paper’s length in centimeters.'],
 ['@この @円 の B1@半径 は @二 B1@センチ です','This circle has a radius of two centimeters.'],
 ['B1@半径 が @違う @二つ の @円 を @描く~描きました~かきました','I drew two circles with different radii.'],
 ['@円 の @中心 から @外 の @線 まで B1@測定 @する~して~して B1@半径 を @調べる~調べました~しらべました','I measured from the center to the outer line to find the circle’s radius.'],
 ['B1@直径 は B1@半径 の @二 @倍 です','The diameter is twice the radius.'],
 ['@この @皿 の B1@直径 を B1@測定 @する~しました~しました','I measured the diameter of this plate.'],
 ['@この @円 の B1@直径 は @十 B1@センチ です','This circle has a diameter of ten centimeters.'],
 ['@糸 を @使う~使って~つかって B1@円周 を B1@測定 @する~しました~しました','I measured the circumference using a thread.'],
 ['B1@円周 の @長い~長さ~ながさ を @ノート に @書く~書きました~かきました','I wrote the circumference’s length in my notebook.'],
 ['@二つ の @円 の B1@円周 を @比べる~比べました~くらべました','I compared the circumferences of the two circles.'],
]);
lesson('lines-and-angles','Lines and angles',['B1@直線','B1@曲線','B1@角度','B1@直角'],
 '直線 / 曲線 / 角度 / 直角','直線 is a straight line; 曲線 is a curve. 角度 is an angle. 直角 is a right angle, like a corner of a square.',[
 ['B1@定規 で B1@直線 を @引く~引きました~ひきました','I drew a straight line with a ruler.'],
 ['@二つ の @点 の @間 に B1@直線 を @引く~引きました~ひきました','I drew a straight line between the two points.'],
 ['@図 の B1@直線 の @長い~長さ~ながさ を B1@測定 @する~しました~しました','I measured the length of the straight line drawn in the diagram.'],
 ['@赤い @ペン で B1@曲線 を @描く~描きました~かきました','I drew a curve with a red pen.'],
 ['@この B1@図形 は B1@曲線 で @できる~できています~できています','This shape is made of curved lines.'],
 ['@図 の B1@直線 と B1@曲線 を @比べる~比べました~くらべました','I compared the straight and curved lines in the diagram.'],
 ['@二つ の @線 の B1@角度 を @調べる~調べました~しらべました','I examined the angle between the two lines.'],
 ['@カメラ の B1@角度 を @変える~変えました~かえました','I changed the camera angle.'],
 ['@同じ B1@角度 から @写真 を @撮る~撮りました~とりました','I took a photograph from the same angle.'],
 ['B1@正方形 の @角 は @全部 B1@直角 です','All the corners of a square are right angles.'],
 ['@この B1@三角 の @角 の @一つ は B1@直角 です','One corner of this triangle is a right angle.'],
 ['@この @角 が B1@直角 か @確認 @する~しました~しました','I checked whether this corner was a right angle.'],
]);
lesson('direction-and-charts','Directions on a page and charts',['B1@水平','B1@垂直','B1@斜め','B1@図表'],
 '水平 / 垂直 / 斜め / 図表','水平 means horizontal or level; 垂直 means vertical or perpendicular to something. 斜め is diagonal or slanting. 図表 includes charts, graphs and diagrams.',[
 ['@机 が B1@水平 か @確認 @する~しました~しました','I checked whether the desk was level.'],
 ['@紙 に B1@水平 な @線 を @引く~引きました~ひきました','I drew a horizontal line on the paper.'],
 ['@カメラ を B1@水平 に @持つ~持ちました~もちました','I held the camera level.'],
 ['B1@垂直 な @線 を @青い @ペン で @引く~引きました~ひきました','I drew a vertical line with a blue pen.'],
 ['@この @線 は @下 の @線 に B1@垂直 です','This line is perpendicular to the line below it.'],
 ['@壁 が @床 に B1@垂直 か @調べる~調べました~しらべました','I checked whether the wall was perpendicular to the floor.'],
 ['@紙 を B1@斜め に @置く~置きました~おきました','I placed the paper at an angle.'],
 ['B1@斜め の @線 で B1@四角 を @二つ に @する~しました~しました','I divided the quadrilateral in two with a diagonal line.'],
 ['@写真 が B1@斜め に @なる~なっています~なっています','The photograph is tilted.'],
 ['B1@図表 を @使う~使って~つかって @結果 を @説明 @する~しました~しました','I explained the results using charts.'],
 ['@この B1@図表 は @雨 の @量 の @変化 を @示す~示しています~しめしています','This graph shows changes in rainfall.'],
 ['B1@図表 の @数字 を @確認 @する~しました~しました','I checked the numbers in the chart.'],
]);
lesson('shapes-account','Drawing and checking a diagram',[],
 '図形 / 正方形 / 直角','Follow the drawing and the checks made afterward.',[
 ['B1@定規 で B1@正方形 を @描く~描きました~かきました','I drew a square using a ruler.'],
 ['@同じ @紙 に B1@三角 と B1@楕円 も @描く~描きました~かきました','I also drew a triangle and an oval on the same paper.'],
 ['B1@正方形 の @辺 が @全部 @同じ @長い~長さ~ながさ か @確認 @する~しました~しました','I checked whether all the sides of the square had the same length.'],
 ['B1@正方形 の @角 が B1@直角 か @調べる~調べました~しらべました','I checked whether the square’s corners were right angles.'],
 ['B1@図形 の @下 に @名前 を @書く~書きました~かきました','I wrote the names below the shapes.'],
]);
lesson('integers-and-signs','Integers and signs',['B1@マイナス','B1@整数','B1@イコール'],
 'マイナス / 整数 / イコール','マイナス before a number marks a negative value. 整数 means an integer, such as −2, 0 or 3. イコール means equal and also names the equals sign.',[
 ['@答え は B1@マイナス @三 です','The answer is minus three.'],
 ['@この @数字 の @前 に B1@マイナス を @つける~つけて~つけて ください','Please put a minus sign before this number.'],
 ['B1@マイナス @五 と @ゼロ を @比べる~比べました~くらべました','I compared minus five and zero.'],
 ['@ゼロ も B1@整数 です','Zero is also an integer.'],
 ['@三つ の B1@整数 を @紙 に @書く~書きました~かきました','I wrote three integers on the paper.'],
 ['B1@整数 の @問題 に @答える~答えました~こたえました','I answered the questions about integers.'],
 ['@この @二つ の @答え は B1@イコール です','These two answers are equal.'],
 ['B1@イコール の @右 に @答え を @書く~書きます~かきます','I write the answer to the right of the equals sign.'],
 ['@二つ の @長い~長さ~ながさ が B1@イコール か @確認 @する~しました~しました','I checked whether the two lengths were equal.'],
]);
lesson('calculation-operations','Multiplying, subtracting and dividing',['B1@掛け算','B1@引き算','B1@割り算','B1@等分'],
 '掛け算 / 引き算 / 割り算 / 等分します','掛け算 is multiplication, 引き算 subtraction and 割り算 division. 等分する is dividing something into equal parts.',[
 ['@学校 で B1@掛け算 を @習う~習いました~ならいました','I learned multiplication at school.'],
 ['B1@掛け算 の @答え を @確認 @する~しました~しました','I checked the answer to the multiplication problem.'],
 ['@毎日 B1@掛け算 の @練習 を @する~します~します','I practice multiplication every day.'],
 ['B1@引き算 の @問題 を @三つ @する~しました~しました','I did three subtraction problems.'],
 ['B1@引き算 で @残る~残った~のこった @お金 を @計算 @する~しました~しました','I calculated the money left using subtraction.'],
 ['B1@引き算 の @間違い を @直す~直しました~なおしました','I corrected the subtraction error.'],
 ['B1@割り算 を @使う~使って~つかって @計算 @する~しました~しました','I used division to calculate the answer.'],
 ['B1@割り算 の @方法 を @子供 に @教える~教えました~おしえました','I taught the child how to do division.'],
 ['B1@割り算 の @答え を @ノート に @書く~書きました~かきました','I wrote the answer to the division problem in my notebook.'],
 ['@ケーキ を @三 B1@等分 @する~しました~しました','I divided the cake into three equal parts.'],
 ['@紙 を @二 B1@等分 @する~して~して ください','Please divide the paper into two equal parts.'],
 ['@二 B1@等分 @する~した~した @紙 の @大きい~大きさ~おおきさ を @比べる~比べました~くらべました','I compared the sizes of the two equal pieces of paper.'],
]);
lesson('calculation-account','Checking a calculation',[],
 '整数 / 掛け算 / イコール','Follow the calculation and the check that comes after it.',[
 ['@紙 に @三つ の B1@整数 を @書く~書きました~かきました','I wrote three integers on a sheet of paper.'],
 ['B1@掛け算 の @後 で B1@引き算 を @する~しました~しました','I did subtraction after multiplication.'],
 ['@最後 の @答え は B1@マイナス @五 でした','The final answer was minus five.'],
 ['@もう一度 @計算 @する~して~して @答え が B1@イコール か @確認 @する~しました~しました','I calculated again and checked whether the answers were equal.'],
 ['@間違い が @ある~なかった~なかった から @次 の B1@割り算 の @問題 に @進む~進みました~すすみました','There were no errors, so I moved on to the next division problem.'],
]);
}
