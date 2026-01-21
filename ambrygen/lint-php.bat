@echo off
cd ../..
if exist vendor\bin\phpcs.bat (
    vendor\bin\phpcs.bat --standard=WordPress --extensions=php --ignore=vendor,node_modules,themes/ambrygen/node_modules,themes/ambrygen/assets/build themes/ambrygen
) else (
    echo PHP CodeSniffer not installed - run composer install
    exit /b 1
)
