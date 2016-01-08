<script type="text/javascript">

    var crispTypes = '<?=json_encode($crispsData->crisps)?>';
    var crispHotspots = '<?=$crispsData->hotspots?>';
   
</script>

<div class="food-information crisps"><!-- Food Information Start -->

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
    <div class="weight">Fat per bag</div>

</div><!-- Food Information End -->

<section class="infographics crisps"><!-- Infographics Start -->

    <canvas id="canvas-infographics" width="828" height="448" data-ipad-portrait-width="600" data-ipad-portrait-height="325"></canvas>
    <nav class="crisps" style="background: url('<?=$crispsData->navigation_image?>') no-repeat;"></nav>

    <?php foreach ($crispsData->crisps as $crisps => $data) { ?>
    <div class="rollover-image <?=$data->slug?> is-hidden" data-slug="<?=$data->slug?>" data-landscape-top="" data-landscape-left="" data-portrait-top="" data-portrait-left=""><img src="<?=$data->image_rollover?>" width="<?=$data->image_width?>" height="<?=$data->image_height?>" data-landscape-width="" data-landscape-height="" data-portrait-width="" data-portrait-height="" alt="<?=$data->name?>"></div>
    <?php } ?>

</section><!-- Infographics End -->