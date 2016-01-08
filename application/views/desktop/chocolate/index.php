<script type="text/javascript">

    var chocolateBars = '<?=json_encode($chocolateData->chocolate_bars)?>';
    var chocolateBarHotspots = '<?=$chocolateData->hotspots?>';

</script>

<div class="food-information chocolate is-hidden"><!-- Food Information Start -->

    <h2 class="name"><span class="line-1"></span><span class="line-2"></span></h2>
    <hr class="top"/>
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
    <div class="weight">Fat per bar</div>

</div><!-- Food Information End -->

<section class="infographics chocolate" style="background-image: url(<?=$chocolateData->all_chocolate_bars_image?>);"><!-- Infographics Start -->

    <canvas id="canvas-infographics" width="734" height="264" data-ipad-portrait-width="550" data-ipad-portrait-height="198"></canvas>

    <?php foreach ($chocolateData->chocolate_bars as $chocolateBar => $data) { ?>
    <div class="cross-section <?=$data->slug?> is-hidden" data-slug="<?=$data->slug?>" data-landscape-top="" data-landscape-left="" data-portrait-top="" data-portrait-left=""><img src="<?=$data->image?>" width="<?=$data->image_width?>" height="<?=$data->image_height?>" data-landscape-width="" data-landscape-height="" data-portrait-width="" data-portrait-height="" alt="<?=$data->name?>"></div>
    <?php } ?>

</section><!-- Infographics End -->