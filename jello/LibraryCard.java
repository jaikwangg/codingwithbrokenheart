import java.util.GregorianCalendar;

public class LibraryCard {
    private GregorianCalendar expirationDate;

    // Setter for expiration date
    public void setExpDate(GregorianCalendar date) {
        this.expirationDate = date;
    }

    // Getter for year
    public int getExpYear() {
        return expirationDate.get(GregorianCalendar.YEAR);
    }

    // Getter for month
    public int getExpMonth() {
        return expirationDate.get(GregorianCalendar.MONTH) + 1; // +1 because MONTH is 0-based
    }

    // Getter for day
    public int getExpDay() {
        return expirationDate.get(GregorianCalendar.DAY_OF_MONTH);
    }

    // For demo (optional)
    public void printExpirationDate() {
        System.out.println("Expires on: " + getExpDay() + "/" + getExpMonth() + "/" + getExpYear());
    }
}
