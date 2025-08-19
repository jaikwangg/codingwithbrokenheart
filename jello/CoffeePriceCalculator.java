import java.util.Scanner;

public class CoffeePriceCalculator {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        final double PRICE_PER_POUND = 5.99;
        final double SALES_TAX_RATE = 0.0725;

        System.out.print("Enter number of bags sold: ");
        int numberOfBags = input.nextInt();

        System.out.print("Enter weight per bag (in pounds): ");
        double weightPerBag = input.nextDouble();

        double totalPrice = numberOfBags * weightPerBag * PRICE_PER_POUND;
        double totalPriceWithTax = totalPrice + (totalPrice * SALES_TAX_RATE);

        System.out.printf("\nNumber of bags sold:   %d\n", numberOfBags);
        System.out.printf("Weight per bag:        %.2f lb\n", weightPerBag);
        System.out.printf("Price per pound:       $%.2f\n", PRICE_PER_POUND);
        System.out.printf("Sales tax:             %.2f%%\n", SALES_TAX_RATE * 100);
        System.out.printf("\nTotal price:           $%.3f\n", totalPriceWithTax);
        input.close();
    }
}
