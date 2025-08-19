import java.util.GregorianCalendar;

public class Student {
    public static void main(String[] args) {
        LibraryCard card = new LibraryCard();

        // Set expiration date to 15 December 2025
        GregorianCalendar date = new GregorianCalendar(2025, GregorianCalendar.DECEMBER, 15);
        card.setExpDate(date);

        // Print expiration date
        System.out.println("Year: " + card.getExpYear());
        System.out.println("Month: " + card.getExpMonth());
        System.out.println("Day: " + card.getExpDay());
        card.printExpirationDate();  // Optional
    }
}
