<script type="text/javascript">

    var segments = '<?=json_encode($pieData->segments)?>';
    var segmentsCoords = '<?=$pieData->segments_coords?>';
    var radius = <?=$pieData->radius?>;
    var slice = <?=json_encode($pieData->slice)?>;
    
</script>

<div class="food-information <?=$pieData->type?> is-hidden"><!-- Food Information Start -->

    <h2 class="name"><span class="line-1"></span><span class="line-2"></span></h2>
    <hr class="top"/>
    <?php if(strcmp($pieData->slice, 'true') == 0){ ?>
        <img class="slice" src="" alt=""/>
    <?php } ?>
    <div class="fat first">
        Fat: 
        <span class="amount"></span><span class="grams">G</span>
    </div>
    <div class="calories">
        Calories: <span class="amount"></span>
    </div>
    <div class="carbs">
        Carbs: <span class="amount"></span><span class="grams">G</span>
    </div>
    <div class="protein">
        Protein: <span class="amount"></span><span class="grams">G</span>
    </div>
    <hr class="bottom"/>
    <div class="weight">Per slice: 100G</div>
    <div class="legend">&#37; = the percentage of total fat in the <?=$pieData->type?> collection.</div>

</div><!-- Food Information End -->

<section class="infographics pie-chart <?=$pieData->type?>" style="background-image: url(<?=$pieData->chart_image?>);"><!-- Infographics Start -->

    <canvas id="canvas-infographics" width="960" height="719" data-ipad-portrait-width="768" data-ipad-portrait-height="575"></canvas>

    <?php foreach ($pieData->segments as $segment => $data) { ?>
    <div class="percent <?=$pieData->type?> <?=$data->slug?> is-hidden" data-slug="<?=$data->slug?>"><?=$data->information->percent?>&percnt;</div>
    <?php } ?> 

</section><!-- Infographics End -->

