using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Forms_FRM_JUR_02 : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;
    string pase = Servicio.Verificarusuario(HttpContext.Current.User.Identity.Name);
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            String s = Request.QueryString["id"];
            buscaop(s.Trim());
            Muestradetenidos();            
        }
    }
    private void buscaop(string valoridop)
    {
        string strSQLverif = "SELECT ASIGNACION.Casos_Id, ASIGNACION.NroCaso, ASIGNACION.NroOperativo, ASIGNACION.NombreCaso, ASIGNACION.AsigCaso, ASIGNACION.FiscalAsigCaso, ASIGNACION.NroCasoPerDom, ASIGNACION.IANUS, ETAPAINVEST.Descripcion, OPERATIVO.Op_Descripcion, OPERATIVO.Op_Id " +
                             "FROM ASIGNACION INNER JOIN ETAPAINVEST ON ASIGNACION.Eta_Inv = ETAPAINVEST.Eta_Inv INNER JOIN OPERATIVO ON ASIGNACION.Casos_Id = OPERATIVO.Casos_Id " +
                             "WHERE (ASIGNACION.Casos_Id = " + Convert.ToInt32(valoridop.Trim()) + ")";
        DataTable dtlista = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmdrev = new SqlCommand(strSQLverif);
        cmdrev.CommandType = CommandType.Text;
        cmdrev.Connection = SqlConn;
        SqlDataAdapter sdrev = new SqlDataAdapter(cmdrev);
        sdrev.Fill(dtlista);
        for (int i = 0; i < dtlista.Rows.Count; i++)
        {
            lblidcaso.Text = dtlista.Rows[i][0].ToString();
            txtnrocaso.Text = dtlista.Rows[i][1].ToString();
            txtnroop.Text = dtlista.Rows[i][2].ToString();
            txtnombrecaso.Text = dtlista.Rows[i][3].ToString();
            txtasignadocaso.Text = dtlista.Rows[i][4].ToString();
            txtfiscalasignado.Text = dtlista.Rows[i][5].ToString();
            txtperdom.Text = dtlista.Rows[i][6].ToString();
            lblcud.Text = dtlista.Rows[i][7].ToString();
            lbletapa.Text = dtlista.Rows[i][8].ToString();            
            lblidoperativo.Text = dtlista.Rows[i][10].ToString();
        }
        SqlConn.Close();
    }
    private void Muestradetenidos()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT DETENIDOSAUX.De_Id AS Det1, RTRIM(DETENIDOSAUX.De_Nombres) + ' ' + RTRIM(DETENIDOSAUX.De_Paterno) + ' ' + RTRIM(DETENIDOSAUX.De_Materno) + ' ' + RTRIM(DETENIDOSAUX.De_Esposo) AS Det2, PAIS.Descripcion AS Det3, (CASE WHEN (DETENIDOSAUX.Genero = 1) THEN 'Masculino' ELSE 'Femenino' END) AS Det4, (CASE WHEN (De_Fechanac IS NULL) THEN '*' ELSE (CONVERT(char(10), De_Fechanac, 103)) END) AS Det5, ESTADOCIVIL.Descripcion AS Det6, DETENIDOSAUX.Serie AS Det7, DETENIDOSAUX.Seccion AS Det8, DETENIDOSAUX.Direccion AS Det9, (CASE WHEN (DETENIDOSAUX.Tarjeta = 1) THEN 'SI' ELSE 'NO' END) AS Det10, (CASE WHEN (DETENIDOSAUX.Vivo = 1) THEN 'Vivo' ELSE 'Fallecido' END) AS Det11 " +
                                 "FROM DETENIDOSAUX INNER JOIN PAIS ON DETENIDOSAUX.Pa_Id = PAIS.Pa_Id INNER JOIN ESTADOCIVIL ON DETENIDOSAUX.Ec_id = ESTADOCIVIL.Ec_id " +
                                 "WHERE (DETENIDOSAUX.Op_Id = " + Convert.ToInt32(lblidoperativo.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridpersonas.DataSource = ds;
        gridpersonas.DataBind();
        con.Close();
    }
    protected void gridpersonas_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = gridpersonas.SelectedRow;
        LblIdDet.Text = row.Cells[0].Text;
        limpiasitu();
        Muestrasitu();
        limpiaetapa();
        Etapalegal();
        Muestraetapas();
    }    
    private void Situlegal()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT SL_Id, Descripcion FROM SITUACIONLEGAL";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        ddlsitualeg.ClearSelection();
        ddlsitualeg.Items.Clear();
        ddlsitualeg.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            ddlsitualeg.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }

    private void limpiasitu()
    {
        txtsituresolucion.Text = "";
        txtsitudep.Text = "";
        txtsitufechares.Text = "";
        txtsitujuez.Text = "";
        txtsitujuz.Text = "";
        Situlegal();
        ddlsitualeg.Focus();
    }
    private void Muestrasitu()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT SITUACION.SIT_Id AS Sl1, SITUACIONLEGAL.Descripcion AS Sl2, SITUACION.NroResolucion AS Sl3, SITUACION.Lugar AS Sl4, (CASE WHEN (SITUACION.Fecha IS NULL) THEN '' ELSE (CONVERT(char(10), SITUACION.Fecha, 103)) END) AS Sl5, SITUACION.Autoridad AS Sl6, SITUACION.FJT AS Sl7 " +
                                                "FROM SITUACION INNER JOIN SITUACIONLEGAL ON SITUACION.SL_Id = SITUACIONLEGAL.SL_Id WHERE (SITUACION.De_Id = " + Convert.ToInt32(LblIdDet.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridsituacion.DataSource = ds;
        gridsituacion.DataBind();
        con.Close();
    }
    protected void btnsituacion_Click(object sender, EventArgs e)
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO SITUACION (De_Id, SL_Id, NroResolucion, Lugar, Fecha, Autoridad, FJT, UpdInf, fechahoraing, Usuario) VALUES (@De_Id, @SL_Id, @NroResolucion, @Lugar, @Fecha, @Autoridad, @FJT, @UpdInf, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter De_Id = new SqlParameter("@De_Id", SqlDbType.Int);
        De_Id.Value = Convert.ToInt32(LblIdDet.Text.Trim());
        cmd.Parameters.Add(De_Id);
        SqlParameter SL_Id = new SqlParameter("@SL_Id", SqlDbType.Int);
        SL_Id.Value = Convert.ToInt32(ddlsitualeg.SelectedValue.ToString());
        cmd.Parameters.Add(SL_Id);
        SqlParameter NroResolucion = new SqlParameter("@NroResolucion", SqlDbType.NVarChar, 50);
        NroResolucion.Value = txtsituresolucion.Text.Trim().ToUpper();
        cmd.Parameters.Add(NroResolucion);
        SqlParameter Lugar = new SqlParameter("@Lugar", SqlDbType.NVarChar, 100);
        Lugar.Value = txtsitudep.Text.Trim().ToUpper();
        cmd.Parameters.Add(Lugar);
        SqlParameter Fecha = new SqlParameter("@Fecha", SqlDbType.DateTime);
        Fecha.Value = Convert.ToDateTime(txtsitufechares.Text.Trim());
        cmd.Parameters.Add(Fecha);
        SqlParameter Autoridad = new SqlParameter("@Autoridad", SqlDbType.NVarChar, 150);
        Autoridad.Value = txtsitujuez.Text.Trim().ToUpper();
        cmd.Parameters.Add(Autoridad);
        SqlParameter FJT = new SqlParameter("@FJT", SqlDbType.NVarChar, 100);
        FJT.Value = txtsitujuz.Text.Trim().ToUpper();
        cmd.Parameters.Add(FJT);
        SqlParameter UpdInf = new SqlParameter("@UpdInf", SqlDbType.NText);
        UpdInf.Value = "";
        cmd.Parameters.Add(UpdInf);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        limpiasitu();
        Muestrasitu();
    }
    //ETAPAS
    private void limpiaetapa()
    {
        txtetapanrres.Text = "";
        txtetadepart.Text = "";
        txtetafecha.Text = "";
        txtetaautoridad.Text = "";
        txtetafiscalia.Text = "";
        Etapalegal();
        ddletapa.Focus();
    }
    private void Etapalegal()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT ET_Id, Descripcion FROM ETAPA";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        ddletapa.ClearSelection();
        ddletapa.Items.Clear();
        ddlestado.ClearSelection();
        ddlestado.Items.Clear();
        ddletapa.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            ddletapa.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void ddletapa_SelectedIndexChanged(object sender, EventArgs e)
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Est_Id, Descripcion FROM ESTADO WHERE (ET_Id = " + Convert.ToInt32(ddletapa.SelectedValue.ToString()) + ")";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        ddlestado.ClearSelection();
        ddlestado.Items.Clear();
        ddlestado.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            ddlestado.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
        ddlestado.Focus();
    }    
    private void Muestraetapas()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ETAPAPROCESO.EP_Id AS Ep1, ETAPA.Descripcion AS Ep2, ESTADO.Descripcion AS Ep3, ETAPAPROCESO.NroResolucion AS Ep4, ETAPAPROCESO.Lugar AS Ep5, ETAPAPROCESO.Fecha AS Ep6, ETAPAPROCESO.Autoridad AS Ep7, ETAPAPROCESO.FJT AS Ep8 " +
                                                "FROM ETAPAPROCESO INNER JOIN ESTADO ON ETAPAPROCESO.Est_Id = ESTADO.Est_Id INNER JOIN ETAPA ON ESTADO.ET_Id = ETAPA.ET_Id " +
                                                "WHERE (ETAPAPROCESO.De_Id = " + Convert.ToInt32(LblIdDet.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView3.DataSource = ds;
        GridView3.DataBind();
        con.Close();
    }
    protected void btnguardaetapa_Click(object sender, EventArgs e)
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO ETAPAPROCESO (De_Id, Est_Id, NroResolucion, Lugar, Fecha, Autoridad, FJT) VALUES (@De_Id, @Est_Id, @NroResolucion, @Lugar, @Fecha, @Autoridad, @FJT)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter De_Id = new SqlParameter("@De_Id", SqlDbType.Int);
        De_Id.Value = Convert.ToInt32(LblIdDet.Text.Trim());
        cmd.Parameters.Add(De_Id);
        SqlParameter Est_Id = new SqlParameter("@Est_Id", SqlDbType.Int);
        Est_Id.Value = Convert.ToInt32(ddlestado.SelectedValue.ToString());
        cmd.Parameters.Add(Est_Id);
        SqlParameter NroResolucion = new SqlParameter("@NroResolucion", SqlDbType.NVarChar, 50);
        NroResolucion.Value = txtetapanrres.Text.Trim().ToUpper();
        cmd.Parameters.Add(NroResolucion);
        SqlParameter Lugar = new SqlParameter("@Lugar", SqlDbType.NVarChar, 100);
        Lugar.Value = txtetadepart.Text.Trim().ToUpper();
        cmd.Parameters.Add(Lugar);
        SqlParameter Fecha = new SqlParameter("@Fecha", SqlDbType.DateTime);
        Fecha.Value = Convert.ToDateTime(txtetafecha.Text.Trim());
        cmd.Parameters.Add(Fecha);
        SqlParameter Autoridad = new SqlParameter("@Autoridad", SqlDbType.NVarChar, 150);
        Autoridad.Value = txtetaautoridad.Text.Trim().ToUpper();
        cmd.Parameters.Add(Autoridad);
        SqlParameter FJT = new SqlParameter("@FJT", SqlDbType.NVarChar, 100);
        FJT.Value = txtetafiscalia.Text.Trim().ToUpper();
        cmd.Parameters.Add(FJT);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        limpiaetapa();
        Muestraetapas();
    }   
}