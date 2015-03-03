#!/usr/bin/perl -w
use strict;
use Scalar::Util qw(looks_like_number);

my @count;
my @value;
my $mean;
while(<>) {
    @value = split('\t');
    chomp($value[1]);
    if($value[0] =~ /\s(\d\d):/ && looks_like_number($value[1])) {
        push @{$count[$1]}, $value[1];
    }
}
for my $i (0 .. $#count) {
    $mean = 0;
    for my $j (0 .. $#{$count[$i]}) {
        $mean += $count[$i][$j];
    }
    $mean = $mean/($#{$count[$i]});
    printf( "%.6f,",$mean);
#     print "$i: \n";
#     print join("\n",@{$count[$i]});
#     print "===========================\n";
}
print "\n"; 
