<script type="text/javascript">

    var sweetTypes = '<?=json_encode($sweetData->sweets)?>';
    var sweetHotspots = '<?=$sweetData->hotspots?>';

</script>

<div class="food-information sweets"><!-- Food Information Start -->

    <h2 class="name"><span class="line-1"></span><span class="line-2"></span></h2>
    <hr class="top"/>
    <div class="sugar first">
        Sugar: 
        <span class="amount"></span><span class="grams">G</span>
    </div>
    <div class="fat">
        Fat: <span class="amount"></span><span class="grams">G</span>
    </div>
    <div class="calories">
        Calories: <span class="amount"></span>
    </div>
    <div class="carbs">
        Carbs: <span class="amount"></span><span class="grams">G</span>
    </div>
    <hr class="bottom"/>
    <div class="weight">Fat bag 100g</div>

</div><!-- Food Information End -->

<section class="infographics sweets" style="background-image: url(<?=$sweetData->all_graph_image?>);"><!-- Infographics Start -->

    <canvas id="canvas-infographics" width="704" height="343" data-ipad-portrait-width="480" data-ipad-portrait-height="234"></canvas>  

    <?php foreach ($sweetData->sweets as $sweets => $data) { ?>
    <div class="sweet <?=$data->slug?>" data-slug="<?=$data->slug?>" data-animated="<?=$data->animated?>" data-steps="<?=$data->steps?>" data-current-step="0" data-landscape-top="" data-landscape-left="" data-portrait-top="" data-portrait-left="" data-landscape-width="" data-landscape-height="" data-portrait-width="" data-portrait-height="" style="background-image: url(<?=$data->image?>);"></div>
    <div class="sweet-name <?=$data->slug?> is-hidden" data-slug="<?=$data->slug?>"><?=$data->name?></div>
    <?php } ?>

</section><!-- Infographics End -->