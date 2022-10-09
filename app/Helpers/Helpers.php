<?php

if (!function_exists('currency')) {
  function currency($number, $withRP = false) {
    $value = number_format($number, 0, ',', '.');
    if ($withRP) {
      $value = 'Rp ' . $value;
    }
    return $value;
  }
}
