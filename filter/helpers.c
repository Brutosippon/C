#include <cs50.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <math.h>
#include <stdlib.h>
#include <stdint.h>
#include "helpers.h"
/*
!!!Fazer site para editar imagem simples com 4 botões!!!
Your program should behave per the examples below:
./filter -g courtyard.bmp yardBlack.bmp
./filter -s courtyard.bmp yardSepia.bmp
./filter -r courtyard.bmp yardRefle.bmp
./filter -b courtyard.bmp yardBlur.bmp
*/

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
//Matriz:
//image[1][3].rgbtRed=0;
//image[2][3].rgbtGreen=0;
//image[3][3].rgbtBlue=0;
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
        RGBTRIPLE pixel = image [i][j];
        int avarege = round((pixel.rgbtRed + pixel.rgbtBlue + pixel.rgbtGreen) / 3.0);
        image[i][j].rgbtRed = avarege;
        image[i][j].rgbtGreen = avarege;
        image[i][j].rgbtBlue = avarege;
        }
    }
}

// Convert image to sepia
int cap(int value)
{
    return value > 255 ? 255 : value;
}

void sepia(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
        RGBTRIPLE pixel = image[i][j];
        //int avarege = round((pixel.rgbtRed + pixel.rgbtBlue + pixel.rgbtGreen) / 3.0);
        int originalRed = pixel.rgbtRed;
        int originalGreen = pixel.rgbtGreen;
        int originalBlue = pixel.rgbtBlue;
        image[i][j].rgbtRed = cap(round(0.393 * originalRed + 0.769 * originalGreen + 0.189 * originalBlue));
        image[i][j].rgbtGreen = cap(round(0.349 * originalRed + 0.686 * originalGreen + 0.168 * originalBlue));
        image[i][j].rgbtBlue = cap(round(0.272 * originalRed + 0.534 * originalGreen + 0.131 * originalBlue));
        }
    }
}

// Reflect image horizontally
void swap(RGBTRIPLE * pixel1, RGBTRIPLE * pixel2)
{
    RGBTRIPLE temp = *pixel1;
    *pixel1 = *pixel2;
    *pixel2 = temp;
}

void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width / 2; j++)
        {
            //[0 , end -1]
            swap(&image[i][j], &image[i][width - 1 - j]);
        }
    }
}

// Blur image
bool is_valid_pixel(int i,int j, int height, int width)
{
    return i >= 0 && i < height && j >= 0 && j < width;
}

RGBTRIPLE get_blur_pixel(int i, int j, int height, int width, RGBTRIPLE image[height][width])
{
    int redValue, blueValue, greenValue; redValue = blueValue = greenValue = 0;
    int num_ValidPixels = 0;
    for (int di = -1; di <= 1; di++)
    {
        for (int dj = -1; dj <= 1; dj++)
        {
            int new_i = i + di;
            int new_j = j + dj;
            if (is_valid_pixel(new_i, new_j, height, width))
            {
                num_ValidPixels++;
                redValue += image[new_i][new_j].rgbtRed;
                blueValue += image[new_i][new_j].rgbtBlue;
                greenValue += image[new_i][new_j].rgbtGreen;

            }
        }
    }
    RGBTRIPLE blur_pixel;
    blur_pixel.rgbtRed = round((float)redValue / num_ValidPixels);
    blur_pixel.rgbtBlue = round((float)blueValue / num_ValidPixels);
    blur_pixel. rgbtGreen = round((float)greenValue / num_ValidPixels);
    return blur_pixel;
}

void blur(int height, int width, RGBTRIPLE image[height][width])
{
    RGBTRIPLE new_image[height][width];
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            new_image[i][j] = get_blur_pixel(i, j, height, width, image);
        }
    }
    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            image[i][j] = new_image[i][j];
        }
    }
}


